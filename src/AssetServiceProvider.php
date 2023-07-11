<?php

namespace MrVaco\NovaPanels;

use Illuminate\Support\ServiceProvider;
use Laravel\Nova\Events\ServingNova;
use Laravel\Nova\Nova;

class AssetServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Nova::serving(function(ServingNova $event)
        {
            Nova::script('nova-panels', __DIR__ . '/../dist/js/asset.js');
            Nova::style('nova-panels', __DIR__ . '/../dist/css/asset.css');
        });
    }
}
