// Headless logic harness, not a browser or visual test.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const nodes=new Map();function el(id){if(!nodes.has(id))nodes.set(id,{innerHTML:'',textContent:'',value:'',checked:false,hidden:false,dataset:{},setAttribute(){},removeAttribute(){},querySelectorAll(){return []},focus(){this.focused=true},scrollIntoView(){},classList:{toggle(){}}});return nodes.get(id);}
const context=vm.createContext({console,document:{querySelector:el,querySelectorAll:()=>[],getElementById:id=>el('#'+id)},localStorage:{getItem:()=>null,setItem(){}},location:{hash:''},history:{replaceState(){}},window:{addEventListener(){}},setTimeout});
for(const f of ['data.js','app.js','learning.js'])vm.runInContext(fs.readFileSync(__dirname+'/'+f,'utf8'),context,{filename:f});
assert.match(el('#compare-insight').innerHTML,/지급 약속/);
assert.match(el('#lesson-content').innerHTML,/말로 약속/);
vm.runInContext('lessonStep=2;renderLesson();state=lessonValues();renderBuilder()',context);
assert.match(el('#story').textContent,/100만 원/);assert.match(el('#story').textContent,/별도로 발행/);
assert.equal(JSON.parse(vm.runInContext('exportText(state)',context)).attributes.interest,'무이자');
vm.runInContext("state.condition='조건부 지급 의무';renderResult()",context);
assert.match(el('#validation').innerHTML,/data-jump="condition"/);
el('#validation').onclick({target:{closest:()=>({dataset:{jump:'condition'}})}});assert.ok(el('#condition').focused);
vm.runInContext("state.guarantee='보증부';state.debtors='연대 책임';state.securitization='자산유동화 구조';renderResult()",context);
for(const term of ['보증인','추가 채무자','양수인','유동화 기구'])assert.ok(el('#build-diagram').innerHTML.includes(term),term);
assert.match(el('#mobile-result').textContent,/결과 보기/);
const exported=JSON.parse(el('#json-preview').textContent);assert.equal(Object.keys(exported.attributes).length,25);assert.equal(exported.version,2);
console.log('PASS: script integration, 3-step lesson, narrative, guidance focus, relationship layers, mobile summary, 25-field JSON serialization');
