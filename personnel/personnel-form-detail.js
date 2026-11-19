(function () {
    'use strict';

    const drawer = document.getElementById('form-detail-drawer');
    const sidebar = drawer.querySelector('.flow-right-fixed');
    const stateLabels = { done: '已完成', pending: '进行中', rejected: '已驳回', unstarted: '未发起' };
    const icons = {
        chevron: '<path d="m6 9 6 6 6-6"/>',
        arrowLeft: '<path d="m14 7-5 5 5 5"/>',
        arrowRight: '<path d="m9 7 5 5-5 5"/>',
        close: '<path d="m6 6 12 12M6 18 18 6"/>',
        user: '<circle cx="12" cy="8" r="3"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/>',
        check: '<path d="m5 12 4 4L19 6"/>',
        pending: '<circle cx="6" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="18" cy="12" r="1"/>',
        graph: '<rect x="9" y="2" width="6" height="5" rx="1"/><path d="M12 7v5M5 16v-4h14v4"/><rect x="2" y="16" width="6" height="5" rx="1"/><rect x="16" y="16" width="6" height="5" rx="1"/>',
        content: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 7h10M7 11h6m2 5 2 2 4-4"/>',
        expand: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16m3-12 4 4-4 4"/>'
    };
    function svg(name, size = 16) {
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;
    }
    function esc(value) {
        return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
    }
    function node(title, status, time, people, rule = '', opinion = '') {
        return { title, status, time, people, rule, opinion };
    }
    const agreed = name => ({ name, result: '同意' });
    const waiting = name => ({ name, result: '' });
    const records = [
        { id: 'main', title: '(组织提取岗)交接班考核记录表', relation: '主表单', status: 'done', started: '2026-11-16 15:55:30', creator: '李何02', nodes: [
            node('发起审批', 'done', '2026-11-16 15:55:30', [agreed('李何02')]),
            node('分值填写并审核', 'done', '2026-11-16 16:10:15', [agreed('李何02')], '1人 会签', '理论、实操及仪器考核均达标，综合评分92分。')
        ] },
        { id: 'compare', title: '实验室内部比对记录及分析报告表（理论+实操）', relation: '关联发起', status: 'done', started: '2026-11-16 16:15:00', creator: '李何02', source: 'sec-view-compare', nodes: [
            node('发起审批', 'done', '2026-11-16 16:15:00', [agreed('李何02')]),
            node('报告医生审核', 'done', '2026-11-16 16:30:00', [agreed('李建华'), agreed('李何01')], '2人 会签', '原测结果与现测结果吻合，比对结论符合要求。'),
            node('技术组长审核', 'done', '2026-11-16 16:45:00', [agreed('李何02'), waiting('李何01')], '2人 或签', '同意归档。')
        ] },
        { id: 'auth', title: '授权申请审核表', relation: '关联发起', status: 'pending', started: '2026-11-16 16:50:00', creator: '李何02', source: 'sec-view-auth', nodes: [
            node('发起审批', 'done', '2026-11-16 16:50:00', [agreed('李何02')]),
            node('技术主管审核', 'done', '2026-11-16 17:00:00', [agreed('王主任'), agreed('李何01')], '2人 会签', '考核资料完整，岗位能力符合要求。'),
            node('质量主管审核', 'done', '2026-11-16 17:05:00', [agreed('李何02'), waiting('李何01')], '2人 或签', '同意授权申请。'),
            node('科主任审批', 'pending', '', [waiting('王主任')], '1人 会签')
        ] },
        { id: 'handover', title: '交接班记录表', relation: '关联发起', status: 'unstarted', started: '', creator: '', source: 'sec-view-record', nodes: [] },
        { id: 'training', title: '人员上岗前技术培训与评估考核表', relation: '手动关联', status: 'done', started: '2026-11-10 09:10:00', creator: '李何01', fields: [['培训项目', '组织提取岗上岗前培训'], ['被培训人', '李何02'], ['培训内容', '操作规程、质量控制及安全要求'], ['考核结果', '合格'], ['评估人', '李何01']], nodes: [
            node('发起审批', 'done', '2026-11-10 09:10:00', [agreed('李何01')]),
            node('培训效果评估', 'done', '2026-11-10 11:20:00', [agreed('李何01')], '1人 会签', '培训考核合格，同意上岗。')
        ] }
    ];
    const candidates = [
        { id: 'annual', title: '人员年度能力复评记录', relation: '手动关联', status: 'rejected', started: '2026-11-12 10:00:00', creator: '李何02', fields: [['被评估人', '李何02'], ['评估年度', '2026年'], ['评估项目', '组织提取及质量控制'], ['补充要求', '补充质量控制考核材料']], nodes: [
            node('发起审批', 'done', '2026-11-12 10:00:00', [agreed('李何02')]),
            node('审批人', 'rejected', '2026-11-12 10:25:00', [{ name: '李何01', result: '驳回' }], '1人 或签', '请补充质量控制考核材料后重新提交。')
        ] },
        { id: 'safety', title: '实验室安全培训记录表', relation: '手动关联', status: 'done', started: '2026-11-13 09:00:00', creator: '李何01', fields: [['培训主题', '实验室安全与应急处置'], ['参与人员', '李何02、李何01'], ['考核结果', '合格']], nodes: [
            node('发起审批', 'done', '2026-11-13 09:00:00', [agreed('李何01')]),
            node('安全负责人审核', 'done', '2026-11-13 11:00:00', [agreed('王主任')], '1人 会签', '已完成安全培训，同意归档。')
        ] }
    ];
    const linkCatalog = [...records.filter(r => r.id !== 'main' && r.status !== 'unstarted'), ...candidates];
    let hasRelated = true;
    let expanded = new Set();
    let activeRecord = null;
    let activeTab = 'process';
    let descending = false;
    let returnFocus = null;
    let linkReturnFocus = null;
    let logRecord = null;
    let logDescending = false;
    let logReturnFocus = null;
    let logParentState = null;

    function visibleRecords() { return hasRelated ? records : records.filter(r => r.id === 'main'); }
    function findRecord(id) { return records.find(r => r.id === id); }
    function tag(record) { return `<span class="pfd-tag ${record.status}">${stateLabels[record.status]}</span>`; }
    function timeline(record) {
        return `<ol class="pfd-timeline">${record.nodes.map((n, i) => `<li class="pfd-node ${n.status}">
            <span class="pfd-node-mark">${svg(n.status === 'rejected' ? 'close' : n.status === 'pending' ? 'pending' : 'check', 12)}</span>
            <div class="pfd-node-title"><span>${esc(n.title)}${i ? ' - ' + (n.status === 'done' ? '审批通过' : n.status === 'pending' ? '进行中' : '审批拒绝') : ''}</span>${n.time ? `<time>${esc(n.time)}</time>` : ''}</div>
            ${n.rule ? `<div class="pfd-sign-rule">${esc(n.rule)}</div>` : ''}
            <div class="pfd-people">${n.people.map(p => `<span class="pfd-person ${p.result === '同意' ? 'agreed' : p.result === '驳回' ? 'rejected' : ''}"><span class="pfd-person-icon">${svg('user', 15)}</span>${esc(p.name)}${i && p.result ? `（${esc(p.result)}）` : ''}</span>`).join('')}</div>
        </li>`).join('')}</ol>`;
    }
    function chooseDefault() {
        const eligible = visibleRecords().filter(r => r.status === 'pending' || r.status === 'done');
        eligible.sort((a, b) => b.started.localeCompare(a.started));
        expanded = new Set([(eligible[0] || visibleRecords()[0]).id]);
    }
    function render() {
        const list = visibleRecords();
        const completedCount = list.filter(r => r.status === 'done').length;
        sidebar.innerHTML = `<div class="flow-fixed-header"><span class="pfd-header-title">审批进度</span>
            <div class="pfd-header-actions">
            <span class="pfd-header-summary" role="status" aria-label="共${list.length}张表单，${completedCount}张审批通过">已通过 <b>${completedCount}/${list.length}</b></span>
            ${hasRelated ? '<button type="button" class="pfd-link-button" data-action="link" title="关联已有表单">关联已有表单</button>' : ''}</div></div>
            <div class="flow-fixed-scroll">${list.map((r, i) => `<section class="pfd-section ${expanded.has(r.id) ? '' : 'collapsed'}" data-record="${esc(r.id)}">
                <div class="pfd-section-heading">
                    <button type="button" class="pfd-heading-toggle" data-action="toggle" aria-controls="pfd-progress-${esc(r.id)}" aria-label="${expanded.has(r.id) ? '收起' : '展开'}${esc(r.title)}审批进度" aria-expanded="${expanded.has(r.id)}" title="${expanded.has(r.id) ? '收起' : '展开'}审批进度">
                        <span class="pfd-heading-title"><span class="pfd-form-name">${i + 1}. ${esc(r.title)}</span>${tag(r)}</span><span class="pfd-fold">${svg('chevron')}</span>
                    </button>
                    <span class="pfd-relation ${r.relation === '手动关联' ? 'manual' : ''}">${esc(r.relation)}</span>
                    <div class="pfd-section-actions">
                        <button type="button" class="pfd-section-action ${r.status === 'unstarted' ? 'pfd-launch' : ''}" data-action="${r.status === 'unstarted' ? 'launch' : 'view'}" title="${r.status === 'unstarted' ? '发起' : '查看'}${esc(r.title)}">${r.status === 'unstarted' ? '发起' : '查看'}</button>
                        ${r.relation === '手动关联' ? '<button type="button" class="pfd-section-action pfd-remove" data-action="remove" title="移除关联">移除</button>' : ''}
                    </div>
                </div>
                <div class="pfd-progress" id="pfd-progress-${esc(r.id)}"><div class="pfd-progress-tools"><button type="button" class="pfd-text-button" data-action="process" ${r.status === 'unstarted' ? 'disabled' : ''}>审批流程</button><button type="button" class="pfd-text-button" data-action="logs" ${r.status === 'unstarted' ? 'disabled' : ''}>审批日志</button></div>${r.nodes.length ? timeline(r) : '<div class="pfd-empty">尚未发起，暂无审批记录</div>'}</div>
            </section>`).join('')}</div>`;
        const status = document.getElementById('drawer-main-form-status');
        status.textContent = stateLabels[findRecord('main').status];
        status.className = 'pfd-tag ' + findRecord('main').status;
    }
    function toggleContent(force) {
        const collapsed = typeof force === 'boolean' ? force : !drawer.classList.contains('pfd-content-collapsed');
        drawer.classList.toggle('pfd-content-collapsed', collapsed);
        drawer.querySelector('.pfd-collapse-button').setAttribute('aria-expanded', String(!collapsed));
        drawer.querySelector('.pfd-restore-button').setAttribute('aria-expanded', String(!collapsed));
    }

    const modal = document.createElement('div');
    modal.id = 'pfd-modal';
    modal.innerHTML = `<div class="pfd-dialog" role="dialog" aria-modal="true" aria-labelledby="pfd-dialog-title">
        <div class="pfd-dialog-header"><h2 id="pfd-dialog-title"></h2><span id="pfd-dialog-status"></span><button type="button" class="pfd-text-button pfd-close-button" data-action="close" aria-label="关闭详情" title="关闭">关闭</button></div>
        <div class="pfd-dialog-tabs" role="tablist" aria-label="表单详情"></div><div class="pfd-dialog-body" id="pfd-dialog-body" role="tabpanel"></div>
        <div class="pfd-dialog-footer"></div></div>`;
    document.body.appendChild(modal);
    function openDetail(record, tab) {
        returnFocus = document.activeElement;
        activeRecord = record;
        activeTab = tab;
        descending = false;
        drawer.inert = true;
        modal.style.display = 'flex';
        renderDetail();
        modal.querySelector('[data-action="close"]').focus();
    }
    function closeDetail() {
        modal.style.display = 'none';
        drawer.inert = false;
        if (returnFocus && returnFocus.isConnected) returnFocus.focus({ preventScroll: true });
        else drawer.querySelector('.pfd-collapse-button').focus({ preventScroll: true });
    }
    function approvalRecords(record, reverse = descending) {
        const details = [];
        record.nodes.slice(1).forEach(n => n.people.filter(p => p.result).forEach(p => details.push({ ...n, person: p })));
        details.sort((a, b) => a.time.localeCompare(b.time));
        return reverse ? details.reverse() : details;
    }
    function detailsHTML(record, reverse = descending) {
        return approvalRecords(record, reverse).map(n => `<section class="pfd-approval-record"><h3>${esc(n.title)}</h3><div class="pfd-record-fields">
            <span class="pfd-tag ${n.person.result === '驳回' ? 'rejected' : 'done'}">${esc(n.person.result)}</span><p><span class="pfd-field-label">审批人：</span>${esc(n.person.name)}</p>
            <p><span class="pfd-field-label">审批时间：</span>${esc(n.time)}</p>${n.person.result === '驳回' ? `<p><span class="pfd-field-label">退回节点：</span>${esc(n.title)}</p>` : ''}<p><span class="pfd-field-label">审批意见：</span>${esc(n.opinion)}</p></div></section>`).join('') || '<div class="pfd-empty">暂无已处理的审批记录</div>';
    }
    const logDrawer = document.createElement('div');
    logDrawer.id = 'pfd-log-drawer';
    logDrawer.innerHTML = `<section class="pfd-log-panel" role="dialog" aria-modal="true" aria-labelledby="pfd-log-title">
        <header class="pfd-log-header"><h2 id="pfd-log-title">审批日志</h2><button type="button" class="pfd-text-button" data-action="close">关闭</button></header>
        <div class="pfd-log-context"><span class="pfd-log-form-title"></span><span class="pfd-log-status"></span></div>
        <div class="pfd-details-header"><span>审批详情</span><div class="pfd-log-sort" role="group" aria-label="根据审批时间排序"><label><input type="radio" name="pfd-log-sort" value="asc" checked>正序</label><label><input type="radio" name="pfd-log-sort" value="desc">倒序<span>（根据审批时间排序）</span></label></div></div>
        <div class="pfd-details-list" tabindex="0" role="region" aria-label="审批记录"></div></section>`;
    document.body.appendChild(logDrawer);
    function showApprovalLogs(record) {
        logReturnFocus = document.activeElement;
        logParentState = { drawerInert: drawer.inert, modalInert: modal.inert };
        logRecord = record;
        logDescending = false;
        logDrawer.dataset.record = record.id;
        logDrawer.querySelector('.pfd-log-form-title').textContent = record.title;
        logDrawer.querySelector('.pfd-log-status').innerHTML = tag(record);
        logDrawer.querySelector('input[value="asc"]').checked = true;
        logDrawer.querySelector('.pfd-details-list').innerHTML = detailsHTML(record, logDescending);
        logDrawer.querySelector('.pfd-details-list').scrollTop = 0;
        drawer.inert = true;
        modal.inert = true;
        logDrawer.style.display = 'flex';
        logDrawer.querySelector('[data-action="close"]').focus({ preventScroll: true });
    }
    function closeApprovalLogs() {
        logDrawer.style.display = 'none';
        drawer.inert = logParentState.drawerInert;
        modal.inert = logParentState.modalInert;
        if (logReturnFocus && logReturnFocus.isConnected) logReturnFocus.focus({ preventScroll: true });
    }
    function graphNode(title, text, type = '') {
        return `<div class="pfd-graph-node ${type}"><h3>${esc(title)}</h3><p>${esc(text)}</p></div>`;
    }
    function graphHTML(record) {
        const connector = '<div class="pfd-connector"></div>';
        let html = graphNode('发起人', record.creator + ' · 提交表单', 'start');
        if (record.id === 'auth') {
            html += connector + graphNode('岗位分组', '按人员岗位进入对应审核分支', 'condition') + connector;
            html += '<div class="pfd-graph-branches">' + [
                ['技术组条件', '岗位分组包含技术组', '技术主管审核', '王主任、李何01 · 会签'],
                ['诊断组条件', '岗位分组包含诊断组', '诊断组主管审核', '诊断组负责人 · 会签']
            ].map(b => `<div class="pfd-graph-branch">${graphNode(b[0], b[1], 'condition')}${connector}${graphNode(b[2], b[3])}${connector}</div>`).join('') + '</div>';
            html += graphNode('质量主管审核', '李何02、李何01 · 或签') + connector + graphNode('科主任审批', '王主任 · 会签');
        } else {
            html += record.nodes.slice(1).map(n => connector + graphNode(n.title, n.people.map(p => p.name).join('、') + (n.rule ? ' · ' + n.rule : ''))).join('');
        }
        return `<div class="pfd-graph-canvas"><div class="pfd-graph">${html}${connector}${graphNode('结束', '审批完成后归档', 'start')}</div></div>`;
    }
    function renderDetail() {
        const record = activeRecord;
        const graphOpen = activeTab === 'graph';
        modal.classList.toggle('pfd-graph-drawer', graphOpen);
        modal.querySelector('.pfd-dialog').setAttribute('aria-modal', String(!graphOpen));
        drawer.inert = !graphOpen;
        modal.querySelector('h2').textContent = record.title + (graphOpen ? ' · 审批流程图' : '');
        modal.querySelector('#pfd-dialog-status').innerHTML = tag(record);
        const tabs = [['form', '表单内容'], ['process', '审批流程'], ['logs', '审批日志'], ['graph', '流程图']];
        const launching = activeTab === 'launch';
        modal.querySelector('.pfd-dialog-tabs').innerHTML = launching ? '' : tabs.map(([key, text]) => `<button type="button" role="tab" id="pfd-tab-${key}" aria-controls="pfd-dialog-body" aria-selected="${activeTab === key}" data-tab="${key}">${text}</button>`).join('');
        const body = modal.querySelector('.pfd-dialog-body');
        body.scrollTop = 0;
        body.setAttribute('role', graphOpen ? 'region' : 'tabpanel');
        if (graphOpen) body.setAttribute('aria-labelledby', 'pfd-dialog-title');
        else if (!launching) body.setAttribute('aria-labelledby', 'pfd-tab-' + activeTab);
        else body.removeAttribute('aria-labelledby');
        if (activeTab === 'process') {
            body.innerHTML = `<div class="pfd-process-layout"><div class="pfd-process-main"><div class="pfd-process-toolbar"><button type="button" class="pfd-text-button" data-tab="graph">流程图</button><button type="button" class="pfd-text-button" data-tab="form">显示内容</button></div>${timeline(record)}</div>
                <aside class="pfd-approval-details"><div class="pfd-details-header"><span>审批详情</span><label><input type="radio" name="pfd-sort" value="asc" ${!descending ? 'checked' : ''}>正序</label><label><input type="radio" name="pfd-sort" value="desc" ${descending ? 'checked' : ''}>倒序（按审批时间）</label></div><div class="pfd-details-list">${detailsHTML(record)}</div></aside></div>`;
        } else if (activeTab === 'graph') {
            body.innerHTML = graphHTML(record);
        } else if (launching) {
            body.innerHTML = `<form id="pfd-launch-form" class="pfd-launch-fields"><label>交班人<input name="fromPerson" value="李何01" required></label><label>接班人<input name="toPerson" value="李何02" required></label><label>交接日期<input name="date" type="date" value="2026-11-17" required></label><label>设备与试剂清点情况<textarea name="inventory" required></textarea></label></form>`;
        } else {
            body.innerHTML = '<div class="pfd-form-fields"></div>';
            const fields = body.firstElementChild;
            const source = record.source && document.getElementById(record.source);
            if (source && !record.fields) {
                const clone = source.cloneNode(true);
                clone.removeAttribute('id');
                clone.style.display = 'block';
                clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
                clone.querySelectorAll('input, textarea, select, button').forEach(el => { el.disabled = true; });
                fields.appendChild(clone);
            } else {
                const values = record.fields || [['表单名称', record.title], ['发起人', record.creator], ['发起时间', record.started]];
                fields.innerHTML = `<dl>${values.map(([key, value]) => `<dt>${esc(key)}</dt><dd>${esc(value)}</dd>`).join('')}</dl>`;
            }
        }
        modal.querySelector('.pfd-dialog-footer').innerHTML = launching ? '<button type="button" class="btn btn-default" data-action="close">取消</button><button type="submit" class="btn btn-primary" form="pfd-launch-form">提交发起</button>' : '<button type="button" class="btn btn-default" data-action="close">关闭</button>';
    }
    function notify(text) {
        let message = drawer.querySelector('.pfd-toast');
        if (!message) {
            message = document.createElement('span');
            message.className = 'pfd-toast';
            message.setAttribute('role', 'status');
            drawer.querySelector('.drawer-footer-bar').prepend(message);
        }
        message.textContent = text;
    }
    function openLink() {
        linkReturnFocus = document.activeElement;
        const modalLink = document.getElementById('linkFormModal');
        const body = modalLink.firstElementChild.children[1];
        body.innerHTML = `<div class="pfd-link-candidates">${linkCatalog.map(r => {
            const linked = records.some(item => item.id === r.id);
            return `<label class="pfd-link-candidate"><input type="checkbox" value="${esc(r.id)}" ${linked ? 'checked disabled' : ''}><span>${esc(r.title)}<small>${stateLabels[r.status]} · ${esc(r.creator)} · ${esc(r.started)}${linked ? ' · 已关联' : ''}</small></span></label>`;
        }).join('')}</div><div class="pfd-link-error" role="alert"></div>`;
        modalLink.style.display = 'flex';
        drawer.inert = true;
        modalLink.querySelector('button').focus();
    }
    function closeLink() {
        document.getElementById('linkFormModal').style.display = 'none';
        drawer.inert = false;
        if (linkReturnFocus && linkReturnFocus.isConnected) linkReturnFocus.focus({ preventScroll: true });
    }
    function confirmLink() {
        const modalLink = document.getElementById('linkFormModal');
        const selected = [...modalLink.querySelectorAll('input:checked:not(:disabled)')].map(el => el.value);
        if (!selected.length) {
            modalLink.querySelector('.pfd-link-error').textContent = '请至少选择一张尚未关联的表单';
            return;
        }
        selected.forEach(id => {
            const record = linkCatalog.find(r => r.id === id);
            if (record && !findRecord(id)) records.push(record);
        });
        closeLink();
        render();
        notify(`已关联 ${selected.length} 张表单`);
        sidebar.querySelector('[data-action="link"]').focus({ preventScroll: true });
    }

    sidebar.classList.add('pfd-sidebar');
    const collapseButton = drawer.querySelector('.pfd-collapse-button');
    collapseButton.innerHTML = svg('arrowLeft', 12);
    drawer.querySelector('.drawer-body-split').appendChild(collapseButton);
    const restoreButton = document.createElement('button');
    restoreButton.type = 'button';
    restoreButton.className = 'pfd-icon-button pfd-restore-button';
    restoreButton.title = '展开表单详情';
    restoreButton.setAttribute('aria-label', '展开表单详情');
    restoreButton.setAttribute('aria-expanded', 'true');
    restoreButton.innerHTML = svg('arrowRight', 12);
    drawer.querySelector('.drawer-body-split').prepend(restoreButton);
    restoreButton.addEventListener('click', () => toggleContent(false));
    drawer.querySelectorAll('.drawer-left-scroll-pane table').forEach(table => {
        const wrapper = document.createElement('div');
        wrapper.className = 'pfd-table-scroll';
        table.before(wrapper);
        wrapper.appendChild(table);
    });
    sidebar.addEventListener('click', event => {
        const button = event.target.closest('button[data-action]');
        if (!button) return;
        const action = button.dataset.action;
        if (action === 'link') return openLink();
        const record = findRecord(button.closest('[data-record]').dataset.record);
        if (action === 'toggle') {
            if (expanded.has(record.id)) expanded.delete(record.id);
            else expanded.add(record.id);
            render();
            sidebar.querySelector(`[data-record="${record.id}"] [data-action="toggle"]`).focus({ preventScroll: true });
        } else if (action === 'remove') {
            if (window.confirm('确定解除该手动关联？原表单及审批记录将保留。')) {
                records.splice(records.indexOf(record), 1);
                expanded.delete(record.id);
                if (!expanded.size) chooseDefault();
                render();
                notify('已解除手动关联');
            }
        } else if (action === 'logs') {
            showApprovalLogs(record);
        } else if (action === 'view' && record.id === 'main') {
            toggleContent(false);
            window.switchLeftTab('content');
            drawer.querySelector('#btn-ltab-content').scrollIntoView({ block: 'nearest' });
        } else {
            openDetail(record, action === 'view' ? 'form' : action);
        }
    });
    modal.addEventListener('click', event => {
        const button = event.target.closest('button');
        if (event.target === modal || (button && button.dataset.action === 'close')) return closeDetail();
        if (button && button.dataset.tab) {
            if (button.dataset.tab === 'logs') return showApprovalLogs(activeRecord);
            activeTab = button.dataset.tab;
            renderDetail();
            modal.querySelector(`[role="tab"][data-tab="${activeTab}"]`).focus();
        }
    });
    modal.addEventListener('change', event => {
        if (event.target.name === 'pfd-sort') {
            descending = event.target.value === 'desc';
            modal.querySelector('.pfd-details-list').innerHTML = detailsHTML(activeRecord);
        }
    });
    logDrawer.addEventListener('click', event => {
        if (event.target === logDrawer || event.target.closest('[data-action="close"]')) closeApprovalLogs();
    });
    logDrawer.addEventListener('change', event => {
        if (event.target.name !== 'pfd-log-sort') return;
        logDescending = event.target.value === 'desc';
        const list = logDrawer.querySelector('.pfd-details-list');
        list.innerHTML = detailsHTML(logRecord, logDescending);
        list.scrollTop = 0;
    });
    modal.addEventListener('submit', event => {
        if (event.target.id !== 'pfd-launch-form') return;
        event.preventDefault();
        const fields = new FormData(event.target);
        const now = new Date();
        const time = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-') + ' ' + [now.getHours(), now.getMinutes(), now.getSeconds()].map(n => String(n).padStart(2, '0')).join(':');
        activeRecord.status = 'pending';
        activeRecord.started = time;
        activeRecord.creator = fields.get('fromPerson');
        activeRecord.fields = [['交班人', fields.get('fromPerson')], ['接班人', fields.get('toPerson')], ['交接日期', fields.get('date')], ['设备与试剂清点情况', fields.get('inventory')]];
        activeRecord.nodes = [node('发起审批', 'done', time, [agreed(fields.get('fromPerson'))]), node('接班人审核', 'pending', '', [waiting(fields.get('toPerson'))], '1人 会签')];
        expanded = new Set([activeRecord.id]);
        closeDetail();
        render();
        sidebar.querySelector(`[data-record="${activeRecord.id}"] [data-action="view"]`).focus({ preventScroll: true });
        notify('已发起交接班记录，等待接班人审核');
    });
    // Capture Escape before legacy page handlers so only the topmost surface closes.
    document.addEventListener('keydown', event => {
        const link = document.getElementById('linkFormModal');
        const top = logDrawer.style.display === 'flex' ? logDrawer : modal.style.display === 'flex' ? modal : link.style.display === 'flex' ? link : null;
        if (event.key === 'Escape' && top) {
            event.preventDefault();
            event.stopImmediatePropagation();
            if (top === logDrawer) closeApprovalLogs();
            else if (top === modal) closeDetail();
            else closeLink();
        } else if (event.key === 'Tab' && top && !top.classList.contains('pfd-graph-drawer')) {
            const targets = [...top.querySelectorAll('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), [tabindex="0"]')].filter(el => el.getClientRects().length);
            if (event.shiftKey && document.activeElement === targets[0]) {
                event.preventDefault(); targets.at(-1).focus();
            } else if (!event.shiftKey && document.activeElement === targets.at(-1)) {
                event.preventDefault(); targets[0].focus();
            }
        }
    }, true);

    window.closeLinkFormModal = closeLink;
    const linkDialog = document.querySelector('#linkFormModal > div');
    linkDialog.setAttribute('role', 'dialog');
    linkDialog.setAttribute('aria-modal', 'true');
    linkDialog.setAttribute('aria-label', '手动关联已有表单');
    window.personnelFormDetail = {
        toggleContent, openLink, confirmLink,
        open(title, related = true) {
            hasRelated = related;
            if (title) findRecord('main').title = title;
            drawer.querySelector('#drawer-header-title').title = findRecord('main').title;
            chooseDefault();
            toggleContent(false);
            render();
        }
    };
    chooseDefault();
    render();
}());
