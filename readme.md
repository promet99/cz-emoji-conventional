# cz-emoji-conventional

> Conventional commits with great visibility of emoji ✨

## How `cz-emoji-conventional` looks

Here are some examples of git commit titles.

```md
- ✨ feat: add signup pages from (#11)
- 🐛 fix(test): get browser width for android devices
- ♻️ refactor(sc): refactor to styled component
- 🧪 test: add test for splitmerge
```

Format is as below

```text
[emoji] [type]([scope]): [commit msg] (#[issue No.])
```

`emoji` are pre-defined for 7 types (feat, fix, test, chore, build, ci, revert). `scope` & `issue No.` are optional.

## Why `cz-emoji-conventional`?

This commitizen adapter adds emoji alongside conventional commit message format from Angular team.

Colorful emojis makes it easy for you to skim through commit log and find certain kinds of commit.

This commitizen adapter basically works same to [cz-conventional-changelog](https://github.com/commitizen/cz-conventional-changelog), as this package is its fork.

In order to use, install `commitizen` and `cz-emoji-conventional`. Then, just add below to your `package.json`

```json
  "config": {
    "commitizen": {
      "path": "node_modules/cz-emoji-conventional"
    }
  },
```

### Using with `commitlint`
If you wish to use this adapter with `commitlint`, use `commitlint-config-gitmoji` as  configuration
```
npm install -D commitlint-config-gitmoji
```
Then set `useGitmojis` to `true` in the `commitizen` config 
```json
  "config": {
    "commitizen": {
      "path": "node_modules/cz-emoji-conventional",
      "useGitmojis": true
    }
  },
```

## Known Issues
[Issue #4]: https://github.com/promet99/cz-emoji-conventional/issues/4

This section outlines known issues that may occur while using this adapter. Before opening a new issue, please verify that the behavior you're experiencing isn't already documented here.

### Missing Space Between Emoji and Commit Type
If you're using **VS Code** or one of its forks, you *might* notice that certain emojis don't have a space between them and the commit type (e.g., `♻️refactor`). This behavior is due to how the VS Code Terminal handles emojis, and it's *not* related to the adapter itself. You can confirm this by comparing the output in your system's terminal emulator with that in VS Code's terminal. For more details, see the original issue [#4][Issue #4].


## Configuration

Configuration options of [cz-conventional-changelog](https://github.com/commitizen/cz-conventional-changelog) can be used.
For other configuration options, refer to [commitizen](https://github.com/commitizen/cz-cli) repository.
