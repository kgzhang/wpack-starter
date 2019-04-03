# Drag.js的使用说明

1. 确保dragjs加载到body最后

2. 初始化dragjs

```javascript
// 数据回调，脚本会把数据打包传递给本函数
function submit (values) {
    console.log(values)
}

// 初始化drag.js
/**
 * 
 * 参数
 * @param id HMTL文档中的节点，该模块会在本节点渲染
 * @param item 问题数组
 * @param selected 问卷数组
 * @param submit 数据提交回调
*/

drag({
    // 指定渲染节点
    id: 'root',
    items: [
        {
            objectId: '123',
            text: 'haha1'
        },
        {
            objectId: '124',
            text: 'haha2'
        },
        {
            objectId: '125',
            text: 'haha3'
        }
    ],
    selected: [
        {
            objectId: '123',
            extra: [
                {
                    key: '自定义key',
                    value: '自定义value'
                }
            ]
        },
        {
            objectId: '124'
        },
        {
            objectId: '125'
        }
    ],
    submit: submit
})
```

> 本模块未携带http模块，不能进行数据提交，只能将数据打包传递出来
