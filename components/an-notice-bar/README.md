## AnNoticeBar

> 引入组件：

```

import AnNoticeBar from '@/components/an-notice-bar/an-notice-bar.vue"

export default {
	components:{
		AnNoticeBar
	},
}
```

> 使用组件

```
<an-notice-bar :text="noticeMsg"></an-notice-bar>

//哪里使用放哪里
```

> 事件

属性名 | 类型 | 默认值 | 说明 | 平台差异说明 
-|-|-|-|-
text | String | 暂无消息 | 消息集合，多条消息之间用‘|’隔开 | 无
color | String | #de8c17 | 文字颜色 | 无
bgColor | String | #fffbe8 | 整个横条的背景色 | 无
switchTime | Number | 5 | 每条消息切换时间 | 无
