<?php

class SkinPivot extends SkinMustache {
    public function getTemplateData() {
        $data = parent::getTemplateData();

        unset($data['data-portlets-sidebar']['data-portlets-first']['array-items'][3]);
        unset($data['data-portlets-sidebar']['data-portlets-first']['array-items'][4]);

        return $data;
    }
}

?>