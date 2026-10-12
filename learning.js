/* Learning layer: example stories, actionable review and richer relationship diagrams. */
function exportText(v){return JSON.stringify({version:2,purpose:'교육용 예시, 법률적 확정 판정 아님',attributes:v,checks:validate(v),accountCandidate:account(v)},null,2);}
function guidance(a,v){
const t=a.text;
if(t.includes('회사채 예시'))return ['debtor','발행인을 기업으로 변경하거나, 개인 대출이면 일반 채권을 선택하세요.'];
if(t.includes('국채 예시'))return ['debtor','국채를 유지하려면 정부를 선택하세요.'];
if(t.includes('구두 약속'))return ['record','서면을 선택한 뒤 증서별 요건을 확인하세요.'];
if(t.includes('무조건이어야'))return ['condition','어음을 유지하려면 무조건적 지급 의무를 선택하세요. 조건을 유지하려면 일반 계약상 채권을 검토하세요.'];
if(t.includes('일정 금액'))return ['amount','어음 원금을 확정 금액으로 바꾸거나 일반 채권으로 검토하세요.'];
if(t.includes('한 장의 어음'))return ['due','한 장의 어음은 특정 만기와 만기 일시상환으로 구성하세요. 여러 장을 발행하는 구조는 별도 검토가 필요합니다.'];
if(t.includes('지급 지시, 다른'))return ['payment','환어음이면 지급 지시, 직접 지급 약속이면 약속어음 등으로 맞추세요.'];
if(t.includes('담보권 실행을'))return ['collateral','담보부를 선택하거나 불이행 시 권리에서 담보권 실행을 제외하세요.'];
if(t.includes('보증인 청구를'))return ['guarantee','보증부를 선택하거나 불이행 시 권리에서 보증인 청구를 제외하세요.'];
if(t.includes('지급 시점과'))return ['repay','분할 지급에는 원금 균등·원리금 균등을, 특정 만기에는 일시상환을 맞춰 보세요.'];
if(t.includes('주식 전환'))return ['conversion','전환 대상 주식, 발행 주체와 약정 조건을 추가로 확인하세요.'];
if(t.includes('유동화'))return ['securitization','아래 유동화 도식에서 기초자산과 발행 주체를 구분하세요. 단순 양도라면 자산유동화를 선택할 필요가 없습니다.'];
if(t.includes('발행 구조')||t.includes('일반 채권과 발행'))return ['securitization','기초채권과 발행 증권의 층위를 구분하고 발행 구조를 다시 선택하세요.'];
if(t.includes('전자'))return ['record','일반 전자문서인지, 법률상 전자어음·전자등록인지 확인하세요.'];
if(t.includes('이자'))return ['interest','어음면의 이자와 기초계약 이자를 구분해 검토하세요.'];
return [t.includes('시장')?'market':'method','해당 권리에 적용되는 계약·법률상 이전 요건을 확인하세요.'];
}
function narrative(v){const borrower=v.debtor==='개인'?'민수':v.debtor==='기업'?'가온회사':'정부',lender=v.creditor==='개인'?'지수':v.creditor==='은행'?'한빛은행':v.creditor==='기업'?'나래회사':'투자자';let text=v.origin==='외상'?`${borrower}가 ${lender}에게서 100만 원어치 물품을 먼저 받고 대금을 나중에 지급하는 가상 사례입니다.`:v.origin==='대출'?`${borrower}가 ${lender}에게 100만 원을 빌리는 가상 사례입니다.`:v.origin==='증권 발행을 통한 조달'?`${borrower}가 ${lender}에게 증권을 발행해 자금을 조달하는 가상 사례입니다.`:`${borrower}가 ${lender}에게 ${v.origin}에 따른 지급 의무를 부담하는 가상 사례입니다.`;
if(v.form==='약속어음')text+=' 이 거래에 대해 발행인이 수취인에게 지급을 약속하는 어음을 별도로 발행합니다. 대출·외상이라는 원인이 어음으로 바뀌는 것은 아닙니다.';
if(v.form==='환어음')text+=' 환어음에서는 발행인이 지급인에게 지급을 지시합니다. 아래는 지급인이 인수한 후의 관계이며, 이 모형의 채무자 유형은 주된 지급 의무자인 인수인을 기준으로 읽습니다.';
return text;}
const simpleDiagram=diagram;
diagram=function(v){let extra='';const id='extras'+(++diagramId);const box=(y,title,sub)=>`<rect x="15" y="${y}" width="185" height="54" rx="8" fill="#edf3df" stroke="#b6c9aa"/><text x="107" y="${y+22}" text-anchor="middle" font-size="13">${title}</text><text x="107" y="${y+41}" text-anchor="middle" font-size="10">${sub}</text>`;const link=(y,title,sub)=>`<path d="M202 ${y+27} H275" stroke="#345e4d" marker-end="url(#${id})"/><text x="285" y="${y+23}" font-size="12">${title}</text><text x="285" y="${y+43}" font-size="10">${sub}</text>`;let rows=[];
if(v.debtors!=='단독')rows.push(['추가 채무자','Co-debtor','채권자에 대한 책임',v.debtors==='연대 책임'?'연대책임 약정·법적 근거 확인':'각자의 부담 부분·관계 확인']);
if(v.creditors==='다수')rows.push(['여러 채권자','Multiple creditors','채무자에 대한 권리','각 보유분·권리 행사 방식 확인']);
if(v.guarantee==='보증부')rows.push(['보증인 · 수진','Guarantor','채권자에게 보증 책임','범위·요건 충족 시 청구']);
if(v.collateral==='담보부')rows.push(['담보 재산','Collateral','채권자의 담보권','설정·대항요건·순위 확인']);
if(v.transfer==='양도 가능'&&v.method!=='이전 계획 없음')rows.push(['현재 채권자','Current creditor','양수인 · 새 보유자',v.method+' 요건 충족 시']);
if(rows.length)extra=`<h4>선택한 조건이 더하는 관계</h4><svg viewBox="0 0 480 ${rows.length*83}" role="img" aria-label="${rows.map(r=>r[0]+'에서 '+r[2]).join(', ')}"><defs><marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10Z" fill="#345e4d"/></marker></defs>${rows.map((r,i)=>box(i*83+5,r[0],r[1])+link(i*83+5,r[2],r[3])).join('')}</svg><p class="fine">양도 화살표는 가능 경로입니다. 실제 양도가 이루어졌다는 뜻은 아닙니다. 보증·담보·공동 책임은 별도 요건을 따릅니다.</p>`;
if(v.securitization==='자산유동화 구조')extra+=`<h4>자산유동화 · 별도의 층위</h4><svg viewBox="0 0 480 330" role="img" aria-label="기초채무자들이 상환하는 채권을 보유자가 유동화 기구에 이전하고, 유동화 기구가 투자자에게 증권을 발행하는 예시"><defs><marker id="${id}abs" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10Z" fill="#345e4d"/></marker></defs>${['기초채무자들 · Underlying debtors','기초채권 보유자 · Originator','유동화 기구 · SPV / Trust','투자자 · Investors'].map((t,i)=>`<rect x="50" y="${i*82}" width="380" height="40" rx="7" fill="#edf3df"/><text x="240" y="${i*82+25}" text-anchor="middle" font-size="13">${t}</text>${i<3?`<path d="M240 ${i*82+41} V${i*82+78}" stroke="#345e4d" marker-end="url(#${id}abs)"/><text x="255" y="${i*82+64}" font-size="10">${['상환으로 현금흐름 발생','기초채권 이전·신탁','증권 발행 / 현금흐름 배분'][i]}</text>`:''}`).join('')}</svg><p class="fine">전형적인 자산 이전형 구조의 개념도입니다. 투자자의 인수대금은 반대 방향으로 이동합니다. 자산 이전 후 상환금은 유동화 기구에 귀속되며 별도 관리자가 수납할 수 있습니다. 합성 유동화 등 모든 방식을 표현하지 않습니다.</p>`;
return simpleDiagram(v)+extra;};
const basicCompare=renderCompare;
renderCompare=function(){basicCompare();const ps=presets.filter(p=>selected.includes(p.id));const insights=[];if(selected.includes('note')&&selected.includes('bill'))insights.push('약속어음은 발행인의 지급 약속, 환어음은 지급인에 대한 지급 지시입니다. 환어음 지급인은 인수하면 어음상 지급 의무를 집니다.');if(selected.includes('friend')&&selected.includes('iou'))insights.push('둘 다 대출입니다. 이 예시의 핵심 변화는 기록 방식이며, 차용증이라는 제목만으로 약속어음이 되지는 않습니다. 예시에 설정한 금리 차이는 필수 차이가 아닙니다.');if(selected.includes('trade'))insights.push('외상거래는 현금을 빌리는 대신 물품·서비스 대금의 지급을 미룹니다. 외상대금에 대해 어음을 발행할 수도 있습니다.');if(selected.includes('corporate')||selected.includes('government'))insights.push('채권증권 발행과 자산유동화는 다릅니다. 이 회사채·국채 예시는 개별 발행이며, 일반 대출채권도 증권 없이 양도될 수 있습니다.');if(!insights.length)insights.push('발생 원인과 권리 형태를 따로 읽어 보세요. 대출 거래에 약속어음을 함께 사용할 수 있어, 상품 이름이 서로 배타적인 분류는 아닙니다.');const diff=fields.filter(f=>new Set(ps.map(p=>p.values[f.id])).size>1).length;$('#compare-insight').innerHTML=`<h3>이 비교에서 알아볼 점</h3>${insights.map(t=>`<p>${t}</p>`).join('')}<small>25개 기준 중 ${diff}개 값이 다릅니다. 금리·담보·만기 등의 차이는 여기서 선택한 예시 조건입니다.</small>`;};
const basicResult=renderResult;let previousState={...state};
renderResult=function(){basicResult();$('#story').textContent=narrative(state);const changes=fields.filter(f=>previousState[f.id]!==state[f.id]);$('#change-explanation').textContent=changes.length===1?`${changes[0].ko}: ${previousState[changes[0].id]} → ${state[changes[0].id]}. ${changes[0].detail}`:changes.length?`${changes.length}개 조건을 변경했습니다. 아래 사례와 관계도를 함께 읽어 보세요.`:'가상의 거래 사례와 관계도입니다. 조건을 하나씩 바꿔 보세요.';previousState={...state};const alerts=validate(state);$('#validation').innerHTML='<h4>조건을 함께 읽어 보기</h4>'+(alerts.length?alerts.map((a,i)=>{const [field,help]=guidance(a,state);return `<div class="alert ${a.severity}"><b>${a.severity==='conflict'?'조건 충돌 · 모형 기준':'추가 정보·검토 필요'}</b><p>${a.text}</p><p>${help}</p><button type="button" class="secondary" data-jump="${field}">${fields.find(f=>f.id===field).ko} 수정하기 ↑</button></div>`;}).join(''):'<p class="ok">감지한 충돌이 없습니다. 유효성·발행 가능성의 확정 판정은 아닙니다.</p>');$('#mobile-result').textContent=`결과 보기 · ${alerts.filter(a=>a.severity==='conflict').length}개 충돌 / ${alerts.filter(a=>a.severity!=='conflict').length}개 검토 ↑`;
$('#json-preview').textContent=exportText(state);};
$('#validation').onclick=e=>{const b=e.target.closest('[data-jump]');if(b){const f=document.getElementById(b.dataset.jump);f.focus();f.scrollIntoView({block:'center',behavior:'smooth'});}};
$('#mobile-result').onclick=()=>{$('#result-panel').scrollIntoView({block:'start',behavior:'smooth'});$('#result-panel').focus({preventScroll:true});};
let lessonStep=0;
const lessons=[['말로 약속해도, 대출이라는 거래','민수가 지수에게 100만 원을 빌리고 정해진 날 갚기로 했습니다. 이 사례는 무이자입니다. 구두인지 서면인지는 거래 원인과 다른 기준입니다.','friend'],['기록이 생겨도, 여전히 같은 대출','같은 100만 원에 대해 차용증을 씁니다. 증서의 존재만 서면으로 바뀝니다. 차용증을 썼다는 이유로 이자가 생기거나 어음이 되는 것은 아닙니다.','iou'],['대출 위에, 별도의 지급 약속','같은 대출에 대해 무조건 일정 금액을 지급한다는 약속어음을 요건에 맞춰 발행하는 사례입니다. 기초대출과 어음상 권리는 구별하며, 받을 돈을 자동으로 두 배로 세지 않습니다.','note']];
function lessonValues(){const v={...presets[0].values};if(lessonStep>=1)v.record='서면';if(lessonStep===2)Object.assign(v,{form:'약속어음',method:'배서·교부',securitization:'개별 채무증권 발행'});return v;}
function renderLesson(){const l=lessons[lessonStep];$('#lesson-content').innerHTML=`<h4>${l[0]}</h4><p>${l[1]}</p><div class="story-tags"><span>원인: 대출</span><span>기록: ${lessonValues().record}</span><span>형태: ${lessonValues().form}</span><span>이자: 무이자</span></div>`;$('#lesson-steps').querySelectorAll('button').forEach((b,i)=>{b.setAttribute('aria-pressed',i===lessonStep);b.classList.toggle('active',i===lessonStep);});}
$('#lesson-steps').onclick=e=>{const b=e.target.closest('[data-lesson]');if(b){lessonStep=Number(b.dataset.lesson);renderLesson();}};$('#lesson-build').onclick=()=>{state=lessonValues();$('#build-preset').value='custom';renderBuilder();tab('build');$('#build').scrollIntoView({block:'start'});$('#build-preset').focus({preventScroll:true});};
$('#differences').onchange=()=>renderCompare();
renderLesson();renderExplore();renderCompare();renderBuilder();tab(location.hash.slice(1));
