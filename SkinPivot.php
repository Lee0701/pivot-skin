<?php

class SkinPivot extends SkinMustache {
    public function getTemplateData() {
        $data = parent::getTemplateData();

        unset($data['data-portlets-sidebar']['data-portlets-first']['array-items'][3]);
        unset($data['data-portlets-sidebar']['data-portlets-first']['array-items'][4]);

        unset($data['data-footer']['data-places']['array-items'][3]);

        return $data;
    }
}

?>