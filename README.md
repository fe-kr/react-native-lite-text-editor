# React Native Lite Text Editor
[![npm version](https://img.shields.io/npm/v/react-native-lite-text-editor.svg)](https://www.npmjs.com/package/react-native-lite-text-editor)
![Static Badge](https://img.shields.io/badge/github-preview-green?logo=github&link=https%3A%2F%2Ffe-kr.github.io%2Freact-native-lite-text-editor)

A lightweight, embeddable rich text editor for React Native built on a WebView.

## Installation

```bash
npm install react-native-lite-text-editor
# or
yarn add react-native-lite-text-editor
```
_Requires **react-native-webview** as a peer dependency_

## Usage


```js
import { TextEditor, Toolbar } from 'react-native-lite-text-editor';

// see full example in `example/src/App.tsx`

export default function App() {
  const editorRef = useRef(null);
  const [data, setData] = useState(null);

  return (
    <>
      <TextEditor
        ref={editorRef}
        onSelectionChange={(e) => setData(e.nativeEvent.data)}
      />

      <Toolbar
        horizontal
        editorRef={editorRef}
        data={data}
        config={toolbarConfig}
      />
    </>
  );
}

```



## API Overview

### TextEditor Props (extends `WebViewProps`)

| **Prop** | **Type** | **Default** | **Description** | **Notes** |
|---|---:|---:|---|---|
| **autoCapitalize** | `'none'` \| `'sentences'` \| `'words'` \| `'characters'` |  `none` | Controls automatic capitalization for typed text. | Passed through to input handling inside the WebView. |
| **autoCorrect** | `'on' \| 'off'` | `'off'` | Enables or disables platform autocorrect suggestions. | Affects virtual keyboard behavior. |
| **autoFocus** | `'start' \| 'end'` | `-` | Focuses editor on mount and places caret at start or end. | Useful for immediate editing flows. |
| **contentEditable** | `boolean` | `true` | Toggles whether the editor is editable or read-only. | |
| **autoSelect** | `boolean` | `false` | Selects all commands info when the editor loaded. |  |
| **delayLongPress** | `number` (ms) | `500` | Milliseconds before `onLongPress` fires. |  |
| **enterKeyHint** | `'done' \| 'go' \| 'next' \| 'search' \| 'send'` | `-` | Suggests return key action to the virtual keyboard. |  |
| **placeholder** | `string` | `''` | Shown when content is empty. | Style via `styles` / `defaultStyles`. |
| **content** | `string` (HTML) | `''` | Initial HTML content loaded into the editor. | |
| **commands** | `DocumentCommandId[]` | `[]` | Enables built-in document commands (bold, list, link, etc.). | Toolbar use these ids. All commands are enabled, if omitted |
| **extraCommands** | `string[]` | `[]` | Register custom commands. | Should implements DocumentCommand interface |
| **styles** | `string` (CSS) | `''` | CSS injected after `defaultStyles` to override appearance. | Use to match app typography and spacing. |
| **defaultStyles** | `string` (CSS) | `''` | Base CSS applied before `styles`. | Keep minimal; override with `styles`. |
| **onBlur** | `(e) => void` | `-` | Fired when editor loses focus. | Event contains current HTML. |
| **onFocus** | `(e) => void` | `-` | Fired when editor gains focus. |  Event contains current HTML. |
| **onChange** | `(e) => void` | `-` | Fired when content changes. | Event contains current HTML. |
| **onInput** | `(e) => void` | `-` | Low-level input events from the WebView. | Event contains  input type and data |
| **onPress** | `(e) => void` | `-` | Touch press events forwarded from the WebView. | Use for custom tap interactions. |
| **onLongPress** | `(e) => void` | `-` | Long press events forwarded from the WebView. | Controlled by `delayLongPress`. |
| **onKeyDown** | `(e) => void` | `-` | Keyboard keydown events from the editor. | Useful for custom shortcuts. |
| **onKeyUp** | `(e) => void` | `-` | Keyboard keyup events from the editor. | Pair with `onKeyDown` for full key handling. |
| **onPaste** | `(e) => void` | `-` | Fired when content is pasted into the editor. | Inspect or sanitize pasted HTML. |
| **onSelectionChange** | `(e) => void` | `-` | Provides current commands info. | Use to update toolbar active states. |

---

### Toolbar Props (extends `FlatListProps`)

| **Prop** | **Type** | **Default** | **Description** | **Notes** |
|---|---:|---:|---|---|
| **data** | `CommandsInfo[]` | `-` | Array of command info objects used to render toolbar items. ||
| **config** | `ToolbarRenderItem[]` | `-` | Config for render toolbar. Includes items like `'container'`, `'icon'`, `'color'`, `'text'`, `'custom'`. ||
| **renderItem** | `ListRenderItem<ToolbarRenderItem>` | internal renderer | Custom renderer for toolbar cells; receives config item. | |
| **editorRef** | `ExtendedWebViewRef` | `-` | Reference used to send commands to the editor. ||
| **tintColor** | `string` | `rgb(0, 0, 0)` | Color used for inactive icons and text in the toolbar. |
| **activeTintColor** | `string` | `rgb(77, 77, 230)` | Color used for active/selected icons and labels. |
| **iconSize** | `number` | `20` | Size in pixels for toolbar icons. |
| **Icon** | `React.ComponentType<IconProps>` | `-` | Component used to render icons; receives `IconProps`. |
| **dropdownIconProps** | `IconProps` (optional) | `-` | Props forwarded to the dropdown indicator icon. |
| **Popover** | `React.ComponentType<PopoverProps>` | built-in Popover | Component used for popovers (e.g., color pickers, menus). |
| **popoverProps** | `Partial<PopoverProps>` (optional) | `-` | Default props forwarded to the `Popover` component. |
| **tooltipProps** | `Partial<TooltipProps>` (optional) | `-` | Default props forwarded to tooltips for toolbar items. |
---

## Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
