
const title = document.querySelector('#atitle').innerHTML;
const contentEle = document.querySelector('#acontentz');
const script = contentEle.querySelector("script");
if (script) {
  contentEle.removeChild(script)
}
const ins = contentEle.querySelector("ins");
if (ins) {
  contentEle.removeChild(ins)
}
const content = contentEle.innerHTML;
