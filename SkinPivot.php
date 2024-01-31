<?php

class SkinPivot extends SkinMustache {
    public function getTemplateData() {
        $data = parent::getTemplateData();

        unset($data['data-portlets-sidebar']['data-portlets-first']['array-items'][3]);
        unset($data['data-portlets-sidebar']['data-portlets-first']['array-items'][4]);

        unset($data['data-footer']['data-places']['array-items'][3]);

        $data['data-portlets']['data-actions']['class'] .= ' align-bottom';
        $data['data-portlets']['data-personal']['label'] = '<i class="fa-solid fa-circle-user"></i>';
        if($data['data-portlets']['data-personal']['array-items'][0]['name'] == 'anonuserpage') {
            $html = $data['data-portlets']['data-personal']['array-items'][0]['html'];
            $data['data-portlets']['data-personal']['array-items'][0]['html'] = "<a>$html</a>";
        }

        $notification_alert = $data['data-portlets']['data-personal']['array-items'][1];
        $notification_alert['label'] = '<i class="fa-solid fa-bell"></i>';
        $notification_alert['href'] = $notification_alert['array-links'][0]['array-attributes'][1]['value'];
        $data['data-portlets']['data-notifications'] = [];
        $data['data-portlets']['data-notifications']['array-items'][] = $notification_alert;
        array_splice($data['data-portlets']['data-personal']['array-items'], 1, 2);

        return $data;
    }
}

?>