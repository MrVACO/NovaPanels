import NovaCreate from './pages/CreatePage'
import NovaUpdate from './pages/UpdatePage'

Nova.booting((app, store) => {
    Nova.inertia('Nova.Create', NovaCreate)
    Nova.inertia('Nova.Update', NovaUpdate)

    Nova.component('FormPanel', require('./fields/form_panel').default)
    // Nova.component('DetailPanel', require('./fields/detail_panel').default)
    Nova.component('PanelItem', require('./components/PanelItem').default)
    Nova.component("DefaultField", require("./components/DefaultField").default)
})
