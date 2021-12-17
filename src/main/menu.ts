/* eslint-disable @typescript-eslint/no-explicit-any */
import electron, {
  app,
  Menu,
  shell,
  BrowserWindow,
  MenuItemConstructorOptions,
  dialog,
} from 'electron';
import path from 'path';
import fs from 'fs';
import Dao from './sqldb';

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

const dao: Dao = new Dao();

const exeDirPath = path.dirname(electron.app.getPath('exe'));
const dbPath = path.join(exeDirPath, 'sqldb.db');

const openDirPath = (res: any) => {
  const buttonIndex = res.response;
  if (buttonIndex === 1) {
    if (fs.existsSync(exeDirPath)) {
      shell.openPath(exeDirPath);
    }
  }
};

const backUpDateBaseFile = () => {
  dao.getBackUpPathSetting((res: any, err: Error) => {
    const sourceFile = dbPath;
    let backupFile;
    if (err || res === undefined || res === null) {
      backupFile = path.join(exeDirPath, 'sqldb.bak.db');
    } else {
      backupFile = res.back_up_path;
    }
    const readStream = fs.createReadStream(sourceFile);
    const writeStream = fs.createWriteStream(backupFile);
    readStream.pipe(writeStream);
    dialog.showMessageBox({
      type: 'info',
      title: '备份成功',
      message: `备份路径: ${backupFile}`,
    });
  });
};

const changeBackUpPath = (result: any) => {
  const { canceled, filePaths } = result;
  if (!canceled) {
    const backUPFilePath = path.join(filePaths[0], 'sqldb.bak.db');
    dao.updateBackUpPathSetting(backUPFilePath, (_res: any, error: Error) => {
      if (error) {
        dialog.showMessageBox({
          type: 'info',
          title: '修改失败',
          message: `错误日志: ${error}}`,
        });
      } else {
        dialog.showMessageBox({
          type: 'info',
          title: '修改成功',
          message: `新路径为: ${backUPFilePath}`,
        });
      }
    });
  }
};

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu(): Menu {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }

    const template =
      process.platform === 'darwin'
        ? this.buildDarwinTemplate()
        : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment(): void {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: this.mainWindow });
    });
  }

  buildDarwinTemplate(): MenuItemConstructorOptions[] {
    const subMenuAbout: DarwinMenuItemConstructorOptions = {
      label: 'Electron',
      submenu: [
        {
          label: 'About ElectronReact',
          selector: 'orderFrontStandardAboutPanel:',
        },
        { type: 'separator' },
        { label: 'Services', submenu: [] },
        { type: 'separator' },
        {
          label: 'Hide ElectronReact',
          accelerator: 'Command+H',
          selector: 'hide:',
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:',
        },
        { label: 'Show All', selector: 'unhideAllApplications:' },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    };
    const subMenuEdit: DarwinMenuItemConstructorOptions = {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'Command+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+Command+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'Command+V', selector: 'paste:' },
        {
          label: 'Select All',
          accelerator: 'Command+A',
          selector: 'selectAll:',
        },
      ],
    };
    const subMenuViewDev: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: () => {
            this.mainWindow.webContents.reload();
          },
        },
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+Command+I',
          click: () => {
            this.mainWindow.webContents.toggleDevTools();
          },
        },
      ],
    };
    const subMenuViewProd: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
      ],
    };
    const subMenuWindow: DarwinMenuItemConstructorOptions = {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:',
        },
        { label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
        { type: 'separator' },
        { label: 'Bring All to Front', selector: 'arrangeInFront:' },
      ],
    };

    const subMenuView =
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
        ? subMenuViewDev
        : subMenuViewProd;

    return [subMenuAbout, subMenuEdit, subMenuView, subMenuWindow];
  }

  buildDefaultTemplate = () => {
    const templateDefault = [
      {
        label: '&数据管理',
        submenu: [
          {
            label: '&数据库文件',
            click: () => {
              const promise = dialog.showMessageBox({
                type: 'info',
                title: '数据库文件位置, 可拷贝迁移数据',
                message: `数据文件路径:${dbPath}`,
                buttons: ['我知道了', '打开文件位置'],
              });
              promise.then(openDirPath).catch(() => {});
            },
          },
          {
            label: '&SqliteStudio下载',
            click: () => {
              shell.openExternal('https://sqlitestudio.pl/');
            },
          },
          {
            label: '&数据导入导出指导',
            click: () => {
              dialog.showMessageBox({
                type: 'info',
                title: '数据库导入导出指导',
                message: `数据导入导出，请使用SqliteStudio软件，位置在:工具栏->Tools->Import和Output。\n 选择导入导出单张表，为了配合Excel使用，导入导出格式推荐选择.csv`,
              });
            },
          },
        ],
      },
      {
        label: '&备份',
        submenu: [
          {
            label: '&新建备份',
            click: () => {
              backUpDateBaseFile();
            },
          },
          {
            label: '&更改备份文件路径',
            click: () => {
              const promise = dialog.showOpenDialog({
                properties: ['openFile', 'openDirectory', 'multiSelections'],
              });
              promise.then(changeBackUpPath).catch(() => {});
            },
          },
        ],
      },
    ];

    return templateDefault;
  };
}
