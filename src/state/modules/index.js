import camelCase from 'lodash/camelCase'

const context = import.meta.glob('./modules/*.js')

const modulesCache = {}
const storeData = { modules: {} }

async function updateModules() {
  // 获取所有模块路径
  const moduleKeys = Object.keys(context)

  // 循环加载模块
  for (const key of moduleKeys) {
    // 使用 await 确保模块加载完成
    const moduleDefinition = (await context[key]()).default

    console.log('Loaded module:', moduleDefinition); // 打印已加载的模块内容

    // Skip the module during hot reload if it refers to the same module definition as the one we have cached.
    if (modulesCache[key] && modulesCache[key] === moduleDefinition) {
      continue
    }

    // Update the module cache for efficient hot reloading.
    modulesCache[key] = moduleDefinition

    // Get the module path as an array.
    const modulePath = key
      .replace(/^\.\//, '') // 移除 './' 開頭
      .replace(/\.\w+$/, '') // 移除文件擴展名
      .split('/') // 使用 '/' 分割路徑
      .map(camelCase) // 轉換成 camelCase 格式

    // Get the modules object for the current path.
    const { modules } = getNamespace(storeData, modulePath)

    // Add the module to our modules object.
    modules[modulePath.pop()] = {
      namespaced: true,
      ...moduleDefinition
    }
  }

  // 確保只有在開發模式下才執行熱更新
  if (import.meta.hot && import.meta.env.MODE === 'development') {
    const moduleKeys = Object.keys(context)
    moduleKeys.forEach((key) => {
      import.meta.hot.accept(key, () => {
        updateModules() // 在熱更新時調用 updateModules
        import('@/state/store.js').default.hotUpdate({ modules: storeData.modules })
      })
    })
  }
}

// Recursively get the namespace of a Vuex module, even if nested.
function getNamespace(subtree, path) {
  if (path.length === 1) return subtree

  const namespace = path.shift()
  subtree.modules[namespace] = {
    modules: {},
    namespaced: true,
    ...subtree.modules[namespace],
  }
  return getNamespace(subtree.modules[namespace], path)
}

// 確保調用 updateModules 函數
updateModules() // 在這裡調用 updateModules 來加載所有模塊

export default storeData.modules
