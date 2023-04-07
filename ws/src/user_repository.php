<?php

namespace App\Repository;


use App\User;
use swoole_table;

class UsersRepository
{
    /**
     * @var swoole_table
     */
    private $table;

    public function __construct() {
        $this->reCreateTable();
    }

    /**
     * @param int $id
     * @return User|false
     */
    public function get(int $id) {
        $row = $this->table->get($id);
        if ($row !== false) {
            return ['id' => $id, 'data' => $row];
        }
        return false;
    }

    /**
     * Get all online users
     * @param int[] $ids
     * @return User[]
     */
    public function getByIds(array $ids) {
        $users = [];
        foreach ($ids as $id) {
            $row = $this->table->get($id);
            if ($row !== false) {
                $users[] = ['id' => $id, 'data' => $row];
            }
        }
        return $users;
    }

    public function getIdByNicname($nicname, $room=null) {
        foreach ($this->table as $id => $row){
            if($room && $row['nicname'] === $nicname && $row['room'] === $room)
                return $id;
            else if ($row['nicname'] === $nicname)
                return $id;
        }
        return null;
    }

    public function getUsers($room=null){
        $users = [];
        foreach ($this->table as $row){
            if ($room && $row['room'] !== $room)
                continue;
            $users[] = $row['nicname'];
        }
        return $users;
    }

    /**
     * @param int $id
     */
    public function delete(int $id): void {
        $this->table->del($id);
    }

    /**
     * Save user to table in memory;
     */
    public function save($id, $data): void {
        $result = $this->table->set($id, $data);
        if ($result === false) {
            $this->reCreateTable();
            $this->table->set($id, $data);
        }
    }

    public function reCreateTable(): void {
        if (isset($this->table)) {
            $this->table->destroy();
        }
        $this->table = new swoole_table(131072);
        $this->table->column('nicname', swoole_table::TYPE_STRING, 200);
        $this->table->column('room', swoole_table::TYPE_STRING, 200);
        $this->table->create();
    }
}