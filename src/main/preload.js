const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    myPing() {
      ipcRenderer.send('ipc-example', 'ping');
    },
    sendMsg(channel, params) {
      return ipcRenderer.sendSync(channel, params);
    },
    on(channel, func) {
      const validChannels = [
        'ipc-example',
        'query_by_record_id',
        'query_by_record_id_res',
        'delete_by_record_id',
        'insert_record_info',
        'query_by_drawer_id',
      ];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      const validChannels = [
        'ipc-example',
        'query_by_record_id',
        'query_by_record_id_res',
        'delete_by_record_id',
        'insert_record_info',
        'query_by_drawer_id',
      ];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
  },
});
