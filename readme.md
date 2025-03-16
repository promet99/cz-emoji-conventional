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


## Configuration

Configuration options of [cz-conventional-changelog](https://github.com/commitizen/cz-conventional-changelog) can be used.
For other configuration options, refer to [commitizen](https://github.com/commitizen/cz-cli) repository.
