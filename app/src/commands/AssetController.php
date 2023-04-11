<?php
namespace app\commands;

use yii\console\controllers\AssetController as OrigAssetController;
use yii\console\ExitCode;
use yii\helpers\Console;
use yii\console\Controller;

class AssetController extends OrigAssetController
{
    /**
     * Clear web/assets folder for reset assets
     * @return int
     */
    public function actionClear()
    {
        $this->stdout(sprintf('%s: Action clear assets', date('Y-m-d H:i:s')).PHP_EOL, Console::FG_GREEN);
        $dir = \Yii::getAlias('@app/web/assets');
        while (count(scandir($dir)) > 2){
            $this->clearDirectory($dir);
        }
        $this->stdout(sprintf('Done').PHP_EOL, Console::FG_GREEN);
        return ExitCode::OK;
    }

    private function clearDirectory($dir){
        if (file_exists($dir) && is_dir($dir)){
            $files = scandir($dir);
            foreach ($files as $file){
                if ($file == '.' || $file == '..')
                    continue;
                $path = implode(DIRECTORY_SEPARATOR, [$dir, $file]);
                if (file_exists($path) && !is_dir($path))
                    unlink($path);
                if (file_exists($path) && is_dir($path)){
                    if (count(scandir($path)) > 2)
                        $this->clearDirectory($path);
                    else
                        rmdir($path);
                }
            }
        }
    }
}