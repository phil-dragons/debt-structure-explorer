const assert = require('node:assert/strict');
const {fields,presets,validate,account}=require('./data.js');
assert.equal(fields.length,25);
assert.equal(new Set(fields.map(f=>f.id)).size,25);
assert.equal(presets.length,8);
for(const p of presets){
  for(const f of fields) assert.ok(f.options.includes(p.values[f.id]),p.id+': '+f.id);
  assert.equal(validate(p.values).filter(x=>x.severity==='conflict').length,0,p.id);
  assert.ok(account(p.values));
}
const note=presets.find(p=>p.id==='note').values;
for(const change of [{condition:'조건부 지급 의무'},{amount:'변동 금액'},{record:'구두'},{due:'분할 지급'},{payment:'제3자에 대한 지급 지시'},{remedy:'담보권 실행 포함'},{remedy:'보증인 청구 포함'}]){
  assert.ok(validate({...note,...change}).some(x=>x.severity==='conflict'),JSON.stringify(change));
}
assert.ok(validate({...note,securitization:'자산유동화 구조'}).some(x=>x.severity==='review'));
for(const id of ['corporate','government'])assert.ok(validate({...presets.find(p=>p.id===id).values,debtor:'개인'}).some(x=>x.severity==='conflict'));
console.log('PASS: 25 fields, 8 complete presets, 10 adverse scenarios');
