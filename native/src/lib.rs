#[macro_use]
extern crate neon;
extern crate clipboard;

use neon::vm::{Call, JsResult};
use neon::js::JsString;

use clipboard::ClipboardProvider;
use clipboard::ClipboardContext;

fn get_content(call: Call) -> JsResult<JsString> {
    let scope = call.scope;
    let mut ctx: ClipboardContext = ClipboardProvider::new().unwrap();
    Ok(JsString::new(scope, ctx.get_contents().unwrap().as_str()).unwrap())
}

register_module!(m, {
    m.export("get_content", get_content)
});
