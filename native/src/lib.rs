#[macro_use]
extern crate neon;
extern crate clipboard;

use neon::prelude::*;
use std::thread::{sleep};
use std::time::{Duration};

use clipboard::{ClipboardContext, ClipboardProvider};

pub fn poll (mut cx: FunctionContext) -> JsResult<'static, JsUndefined> {
  let mut ctx: ClipboardContext = ClipboardProvider::new().unwrap();
  let mut last: String = ctx.get_contents().unwrap().to_owned();
  let on_change = cx.argument::<JsFunction>(0).unwrap();
  loop {
    let curr = ctx.get_contents().unwrap();
    if &curr == &last {
      let args: Vec<Handle<JsString>> = vec![cx.string(curr.clone())];
      // let args: Vec<Handle<JsNumber>> = vec![cx.number(16.0)];
      let nul = cx.null();
      on_change.call(&mut cx, nul, args).unwrap();
    }
    last = curr;
    sleep(Duration::from_millis(500));
  }
}
