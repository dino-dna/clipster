# clipster

hopefully, your favorite clipboard manager.

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

<div style="text-align: center;">
  <img src='https://github.com/dino-dna/clipster/blob/master/img/screenshot-alpha.png?raw=true' width='400px' alt='screenshot-alpha' />
</div>

<small><i>this project is still fairly alpha.  it's stable, but has a few quirks :)</i></small>

# install

download and install for your OS from [the releases](https://github.com/dino-dna/clipster/releases) page.

## features

- auto-updates
- bookmarks
- optional saving of clipboard history to disk
- history reordering
- simple source code.  welcome hacking

## limitations

- text only

## arch

- in the front, react w/ a simple stupid redux/elm like `(state, msg) => (state, cmd)` thingy
- in the back, electron w/ [menubar](https://github.com/maxogden/menubar), made by my [boooiiii](https://www.youtube.com/watch?v=hBFN6nDs_A4&feature=youtu.be&t=25s), [@denormalize](https://twitter.com/denormalize)

## what's the icon?

it's supposed to be a [clipper](https://duckduckgo.com/?q=clipper+boat&t=ffab&iax=images&ia=images). you know, boats.  it's not super great.  i would love it if someone would help with some [great icons](https://www.electron.build/icons)!

clipper... clipster.  _the clipster clipper™_.

## but but but it uses electron, doesn't that make it heavy?

yes.  yes it does.  until someone can furnish something as easy & fast for native UIs with a largely automated build/publish platform, electron is king, as chubby as it is.
