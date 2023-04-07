<?php

namespace App\Repository;


use App\User;
use swoole_table;

class MessageRepository
{
    const MAX_MESSAGE_LEN = 10000;
    const MSEC_IN_HOUR = 3600000; /*milliseconds in hour*/
    const SEC_IN_HOUR = 3600; /*seconds in hour*/

    /**
     * @var swoole_table
     */
    private $table;

    public function __construct() {
        $this->reCreateTable();
    }

    /**
     * @param int $id
     * @return Publisher|false
     */
    public function get(string $id) {
        $row = $this->table->get($id);
        if ($row !== false) {
            return $row;
        }
        return null;
    }

    /**
     * Get all online users
     * @param int[] $ids
     * @return Message[]
     */
    public function getByIds(array $ids) {
        $data = [];
        foreach ($ids as $id) {
            $row = $this->table->get($id);
            if ($row !== false) {
                $users[] = $row;
            }
        }
        return $data;
    }

    public function getMessages($room=null){
        $data = [];
        foreach ($this->table as $row){
            if ($room && $row['room'] !== $room)
                continue;
            $data[] = $row;
        }
        return $data;
    }

    /**
     * @param $user1
     * @param $user2
     * @param $lefttime (created in last $lefttime hours)
     * @return array
     */
    public function getLastMessages($user1, $user2, $lefttime, $room=null){
        $data = [];
        $now = time();
        foreach ($this->table as $row){
            if ($room && $row['room'] !== $room)
                continue;
            if ($row['created'] < ($now - $lefttime * self::SEC_IN_HOUR))
                continue;
            if (
                ($row['from'] === $user1 && $row['to'] == $user2) ||
                ($row['from'] == $user2 && $row['to'] == $user1)
            ){
                $data[] = $row;
            }
        }
        return $data;
    }

    /**
     * @param int $id
     */
    public function delete(string $id): void {
        if ($this->table->exists($id))
            $this->table->del($id);
    }

    /**
     * Save message to table in memory;
     */
    public function save(array $data) {
        if (!isset($data['message']) || !is_string($data['message']) || strlen($data['message']) === 0 || strlen($data['message']) > self::MAX_MESSAGE_LEN){
            echo "wrong message".PHP_EOL;
            return false;
        }
        if (!isset($data['created'])){
            $data['created'] = time();
        }
        $id = $this->table->count() + 1;
        $result = $this->table->set($id, $data);
        if ($result === false) {
            $this->reCreateTable();
            $this->table->set($id, $data);
        }
        return $data;
    }

    public function reCreateTable(): void {
        if (isset($this->table)) {
            $this->table->destroy();
        }
        $this->table = new swoole_table(131072);
        $this->table->column('created', swoole_table::TYPE_INT);
        $this->table->column('from', swoole_table::TYPE_STRING, 200);
        $this->table->column('to', swoole_table::TYPE_STRING, 200);
        $this->table->column('room', swoole_table::TYPE_STRING, 200);
        $this->table->column('message', swoole_table::TYPE_STRING, self::MAX_MESSAGE_LEN);
        $this->table->create();
    }
}