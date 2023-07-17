<?php

namespace MrVaco\NovaPanels;

use Illuminate\Support\ServiceProvider;
use Laravel\Nova\Events\ServingNova;
use Laravel\Nova\Fields\Field;
use Laravel\Nova\Nova;

class AssetServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Nova::serving(function(ServingNova $event)
        {
            Nova::script('nova-panels', __DIR__ . '/../dist/js/asset.js');
            Nova::style('nova-panels', __DIR__ . '/../dist/css/asset.css');
            
            /*
             * Comes with a 12 point grid system
             * width-1/12 to width-12/12
             */
            Field::macro('width', function(int $columns = 12)
            {
                return $this->withMeta([
                    'width' => $columns
                ]);
            });
            
            /*
             * Set label and field as column? Default "row"
             * Use Field::make(...)->col()
             */
            Field::macro('col', function()
            {
                return $this->withMeta([
                    'col' => true
                ]);
            });
        });
    }
}
