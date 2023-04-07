<?php

namespace App\Repository;


use App\User;
use swoole_table;

class StoreRepository
{
    /**
     * @var swoole_table
     */
    private $store_table;

    public function __construct() {
        $this->reCreateStoreTable();
    }

    /**
     * @param string $key
     * @return string value|false
     */
    public function get($key) {
        $dataRow = $this->store_table->get($key);
        if ($dataRow !== false) {
            return $dataRow['value'];
        }
        return null;
    }

    public function getValues(){
        $data = [];
        foreach ($this->store_table as $row){
            $data[] = $row;
        }
        return $data;
    }

    /**
     * @param string $key
     */
    public function delete($key): void {
        $this->store_table->del($key);
    }

    /**
     * Save value to table in memory;
     */
    public function save($key, $value): void {
        $result = $this->store_table->set($key, ['value' => strval($value)]);
        if ($result === false) {
            $this->reCreateStoreTable();
            $this->store_table->set($key, ['value' => strval($value)]);
        }
    }

    public function reCreateStoreTable(): void {
        if (isset($this->store_table)) {
            $this->store_table->destroy();
        }
        $this->store_table = new swoole_table(4096);
        $this->store_table->column('value', swoole_table::TYPE_STRING, 255);
        $this->store_table->create();
    }
}