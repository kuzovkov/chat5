<?php

namespace App;
use Swoole\Http\Request;
use Swoole\WebSocket\Frame;
use Swoole\WebSocket\Server;
use App\Repository\UsersRepository;
use App\Repository\StoreRepository;
use App\Repository\MessageRepository;

/**
 * Class WebsocketServer
 */
class WebsocketServer
{
    const PING_DELAY_MS = 25000;

    /**
     * @var Server
     */
    private $ws;

    private $usersRepository;
    private $storeRepository;
    private $messageRepository;

    /**
     * WebsocketServer constructor.
     */
    public function __construct() {

        $this->usersRepository = new UsersRepository();
        $this->storeRepository = new StoreRepository();
        $this->messageRepository = new MessageRepository();

        $this->ws = new Server('0.0.0.0', 9502);

        $this->ws->on('start', function (Server $ws){
            echo "OpenSwoole WebSocket Server is started at http://127.0.0.1:9502\n";
        });
        $this->ws->on('open', function ($ws, Request $request): void {
            $this->onConnection($request);
        });
        $this->ws->on('message', function ($ws, Frame $frame): void  {
            $this->onMessage($frame);
        });
        $this->ws->on('close', function ($ws, $id): void  {
            $this->onClose($id);
        });
        $this->ws->on('workerStart', function (Server $ws) {
            $this->onWorkerStart($ws);
        });

        $this->ws->start();
    }

    /**
     * @param Server $ws
     */
    private function onWorkerStart(Server $ws): void {

        $ws->tick(self::PING_DELAY_MS, function () use ($ws) {
            foreach ($ws->connections as $id) {
                $ws->push($id, 'ping', WEBSOCKET_OPCODE_PING);
            }
        });
    }


    /**
     * Client connected
     * @param Request $request
     */
    private function onConnection(Request $request): void {
        echo "client-{$request->fd} is connected\n";
        //var_dump($request);
        $nicname = null;
        $room = null;
        if (isset($request->get)){
            $get = $request->get;
            if (isset($get['nicname'])){
                $nicname = $get['nicname'];
            }
            if (isset($get['room'])){
                $room = $get['room'];
            }
            if ($nicname && $room){
                $this->ws->push($request->fd, json_encode(['type' => 'connect']));
                $user = [
                    'nicname' => $nicname,
                    'room' => $room
                ];
                $this->usersRepository->save($request->fd, $user);
                $usersResponse = $this->usersRepository->getUsers($room);
                foreach ($this->ws->connections as $id){
                    $curr_user = $this->usersRepository->get($id);
                    if ($curr_user['data']['room'] && $curr_user['data']['room'] !== $room)
                        continue;
                    $this->ws->push($id, json_encode(['type' => 'users_online', 'users_online' => $usersResponse]));
                }
            }
        } else {
            $usersResponse = $this->usersRepository->getUsers($room);
            $this->ws->push($request->fd, json_encode(['type' => 'users_online', 'users_online' => $usersResponse]));
        }
    }

    /**
     * @param $frame
     */
    private function onMessage($frame): void {
        echo 'We recieve: ';
        print_r($frame);
        $decodedData = json_decode($frame->data);
        print('data:'.PHP_EOL);
        var_dump($decodedData);
        if (!isset($decodedData->type))
            return;
        $room = null;
        switch ($decodedData->type){
            case 'user_connect':
                if ($decodedData->nicname){
                    $user = ['nicname' => $decodedData->nicname];
                    if ($decodedData->room){
                        $room = $decodedData->room;
                        $user['room'] = $decodedData->room;
                    }
                    $this->usersRepository->save($frame->fd, $user);
                    foreach ($this->ws->connections as $id){
                        if ($room){
                            $curr_user = $this->usersRepository->get($id);
                            if ($curr_user['data']['room'] && $curr_user['data']['room'] !== $room)
                                continue;
                        }
                        $this->ws->push($id, json_encode(['type' => 'new_user', 'user' => $decodedData->nicname]));
                    }
                }
                $ice = \getIce();
                $usersResponse = $this->usersRepository->getUsers($room);
                foreach ($this->ws->connections as $id){
                    if ($room){
                        $curr_user = $this->usersRepository->get($id);
                        if ($curr_user['data']['room'] && $curr_user['data']['room'] !== $room)
                            continue;
                    }
                    if ($frame->fd === $id){
                        $this->ws->push($frame->fd, json_encode(['type' => 'users_online', 'users_online' => $usersResponse, 'ice' => $ice]));
                    } else {
                        $this->ws->push($id, json_encode(['type' => 'users_online', 'users_online' => $usersResponse]));
                    }
                }
                break;

            case 'get_ice':
                $ice = \getIce();
                $this->ws->push($frame->fd, json_encode(['type' => 'ice', 'ice' => $ice]));
                break;

            case 'wrtc_message':
                $user = $this->usersRepository->get($frame->fd);
                if ($user){
                    $nicname = $user['data']['nicname'];
                    $room = $user['data']['room'];
                    $message = $decodedData->message;
                    $adresatId = $this->usersRepository->getIdByNicname($decodedData->to, $room);
                    if ($adresatId){
                        $this->ws->push($adresatId, json_encode(['type' => 'wrtc_message', 'message' => $message, 'from' => $nicname]));
                    }
                }
                break;

            case 'user_message':
                $user = $this->usersRepository->get($frame->fd);
                if ($user && isset($decodedData->message)){
                    $nicname = $user['data']['nicname'];
                    $room = $user['data']['room'];
                    $adresatId = $this->usersRepository->getIdByNicname($decodedData->to, $room);
                    if ($adresatId){
                        $messageObject = $this->messageRepository->save(['from' => $nicname, 'to' => $decodedData->to, 'message' => $decodedData->message, 'room' => $room]);
                        if ($messageObject){
                            $this->ws->push($adresatId, json_encode(['type' => 'new_message', 'message' => $messageObject]));
                            $this->ws->push($frame->fd, json_encode(['type' => 'new_message', 'message' => $messageObject]));
                        }
                    }
                }
                break;

            case 'message_history':
                $user = $this->usersRepository->get($frame->fd);
                if ($user){
                    $nicname = $user['data']['nicname'];
                    $room = $user['data']['room'];
                    if ($decodedData->user1 && $decodedData->user2 && $decodedData->lefttime){
                        $messages = $this->messageRepository->getLastMessages($decodedData->user1, $decodedData->user2, $decodedData->lefttime, $room);
                        $this->ws->push($frame->fd, json_encode(['type' => 'last_messages', 'messages' => $messages]));
                    }
                }
                break;

            default: echo 'unknown message type'.PHP_EOL;
        }

    }


    /**
     * @param $id
     */
    private function onClose(int $id): void {
        echo "client-{$id} is closed\n";
        $user = $this->usersRepository->get($id);
        if (!$user)
            return;
        $nicname = $user['data']['nicname'];
        $room = $user['data']['room'];
        $this->usersRepository->delete($id);
        $this->ws->push($id, json_encode(['type' => 'disconnect']));
        $usersResponse = $this->usersRepository->getUsers($room);
        foreach ($this->ws->connections as $id){
            $curr_user = $this->usersRepository->get($id);
            if ($curr_user['data']['room'] && $curr_user['data']['room'] !== $room)
                continue;
            $this->ws->push($id, json_encode(['type' => 'users_online', 'users_online' => $usersResponse]));
            $this->ws->push($id, json_encode(['type' => 'user_disconnected', 'user' => $nicname]));
        }
    }


}