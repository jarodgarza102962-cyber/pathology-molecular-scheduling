const PB_URL = 'http://127.0.0.1:8090';

async function fetchPersonnel() {
    try {
        const res = await fetch(`${PB_URL}/api/collections/personnel/records?perPage=100&sort=-created`);
        const data = await res.json();
        renderPersonnelList(data.items);
    } catch (e) {
        console.error("Failed to fetch personnel", e);
    }
}

async function fetchCertifications(personId, callback) {
    try {
        const res = await fetch(`${PB_URL}/api/collections/certifications/records?filter=(person_id='${personId}')`);
        const data = await res.json();
        callback(data.items);
    } catch (e) {
        console.error("Failed to fetch certs", e);
    }
}

function renderPersonnelList(records) {
    // 1. Render Query List
    const queryTbody = document.querySelector('#view-archive-query > div > div:nth-child(1) .el-table tbody');
    if (queryTbody) {
        queryTbody.innerHTML = '';
        records.forEach((rec, index) => {
            const tr = document.createElement('tr');
            tr.style.cursor = 'pointer';
            tr.innerHTML = `
                <td class="center">${index + 1}</td>
                <td>${rec.archive_no || ''}</td>
                <td><strong>${rec.name || ''}</strong></td>
            `;
            tr.onclick = () => renderQueryDetail(rec);
            queryTbody.appendChild(tr);
        });
    }

    // 2. Render Maintain List
    const maintainTbody = document.querySelector('#view-archive-maintain > div > div:nth-child(1) .el-table tbody');
    if (maintainTbody) {
        maintainTbody.innerHTML = '';
        records.forEach((rec, index) => {
            const tr = document.createElement('tr');
            tr.style.cursor = 'pointer';
            tr.innerHTML = `
                <td class="center">${index + 1}</td>
                <td>${rec.archive_no || ''}</td>
                <td><strong>${rec.name || ''}</strong></td>
                <td><button class="btn-action-outline danger" style="padding: 2px 5px; font-size: 12px;">删除</button></td>
            `;
            tr.onclick = () => renderMaintainDetail(rec);
            maintainTbody.appendChild(tr);
        });
    }

    // Default select first user if exists
    if (records.length > 0) {
        renderQueryDetail(records[0]);
        renderMaintainDetail(records[0]);
    }
}

function renderQueryDetail(rec) {
    const rightContainer = document.querySelector('#view-archive-query > div > div:nth-child(2)');
    if (!rightContainer) return;
    
    // Header
    const headerCard = rightContainer.querySelector('.box-card:nth-child(1)');
    headerCard.children[0].innerText = `${rec.name}的档案`;
    headerCard.children[1].children[0].querySelector('span').innerText = rec.name;
    headerCard.children[1].children[1].querySelector('span').innerText = rec.status || '未知';

    // Basic Info
    const basicGrid = rightContainer.querySelector('.box-card:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2)');
    if (basicGrid && basicGrid.children.length >= 9) {
        basicGrid.children[0].children[1].innerText = rec.name || '';
        basicGrid.children[1].children[1].innerText = rec.archive_no || '';
        basicGrid.children[2].children[1].innerText = rec.emp_id || '';
        basicGrid.children[3].children[1].innerText = rec.groups || '';
        basicGrid.children[4].children[1].innerText = rec.gender || '';
        basicGrid.children[5].children[1].innerText = rec.birth_date || '';
        basicGrid.children[6].children[1].innerText = rec.education || '';
        basicGrid.children[7].children[1].innerText = rec.major || '';
        basicGrid.children[8].children[1].innerText = rec.title || '';
    }

    // Work Info
    const workGrid = rightContainer.querySelector('.box-card:nth-child(2) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2)');
    if (workGrid && workGrid.children.length >= 5) {
        workGrid.children[0].children[1].innerText = rec.department || '';
        workGrid.children[1].children[1].innerText = rec.profession_group || '';
        workGrid.children[2].children[1].innerText = rec.position || '';
        workGrid.children[3].children[1].innerText = rec.tech_title || '';
        workGrid.children[4].children[1].innerText = rec.status || '';
    }

    // Certifications
    fetchCertifications(rec.id, (certs) => {
        const certTbody = rightContainer.querySelector('.box-card:nth-child(2) > div:nth-child(2) > div:nth-child(5) .el-table tbody');
        if (certTbody) {
            certTbody.innerHTML = '';
            if (certs.length === 0) {
                certTbody.innerHTML = `<tr><td colspan="7" class="center" style="color:#999;padding:30px 0;">暂无资质附件</td></tr>`;
                return;
            }
            certs.forEach(c => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${c.cert_name || ''}</td>
                    <td>${c.cert_no || ''}</td>
                    <td><a href="#" style="color:var(--primary);">${c.file_count || 0}</a></td>
                    <td style="color:#f56c6c;">${c.start_date || ''}</td>
                    <td style="color:#f56c6c;">${c.end_date || ''}</td>
                    <td><span style="color:var(--primary);">${c.is_remind ? '是' : '否'}</span></td>
                    <td><button class="btn-action-outline" style="border-color:#e6a23c; color:#e6a23c;">查看</button></td>
                `;
                certTbody.appendChild(tr);
            });
        }
    });
}

function renderMaintainDetail(rec) {
    const rightContainer = document.querySelector('#view-archive-maintain > div > div:nth-child(2)');
    if (!rightContainer) return;
    
    // Header
    const headerCard = rightContainer.querySelector('.box-card:nth-child(1)');
    headerCard.children[0].innerText = `${rec.name}的档案`;
    headerCard.children[1].children[0].querySelector('span').innerText = rec.name;
    headerCard.children[1].children[1].querySelector('span').innerText = rec.status || '未知';

    // Basic Info
    const basicGrid = rightContainer.querySelector('.box-card:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2)');
    if (basicGrid && basicGrid.children.length >= 9) {
        basicGrid.children[0].querySelector('input').value = rec.name || '';
        basicGrid.children[1].querySelector('input').value = rec.archive_no || '';
        basicGrid.children[2].querySelector('input').value = rec.emp_id || '';
        basicGrid.children[3].querySelector('input').value = rec.groups || '';
        basicGrid.children[4].querySelector('select').innerHTML = `<option>${rec.gender || '未知'}</option><option>男</option><option>女</option>`;
        basicGrid.children[5].querySelector('input').value = rec.birth_date || '';
        basicGrid.children[6].querySelector('select').innerHTML = `<option>${rec.education || '未知'}</option>`;
        basicGrid.children[7].querySelector('input').value = rec.major || '';
        basicGrid.children[8].querySelector('select').innerHTML = `<option>${rec.title || '未知'}</option>`;
    }

    // Work Info
    const workGrid = rightContainer.querySelector('.box-card:nth-child(2) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2)');
    if (workGrid && workGrid.children.length >= 5) {
        workGrid.children[0].querySelector('select').innerHTML = `<option>${rec.department || '未知'}</option>`;
        workGrid.children[1].querySelector('select').innerHTML = `<option>${rec.profession_group || '未知'}</option>`;
        workGrid.children[2].querySelector('input').value = rec.position || '';
        workGrid.children[3].querySelector('input').value = rec.tech_title || '';
        workGrid.children[4].querySelector('select').innerHTML = `<option>${rec.status || '未知'}</option>`;
    }

    // Certifications
    fetchCertifications(rec.id, (certs) => {
        const certTbody = rightContainer.querySelector('.box-card:nth-child(2) > div:nth-child(2) > div:nth-child(5) .el-table tbody');
        if (certTbody) {
            certTbody.innerHTML = '';
            if (certs.length === 0) {
                certTbody.innerHTML = `<tr><td colspan="7" class="center" style="color:#999;padding:30px 0;">暂无资质附件</td></tr>`;
                return;
            }
            certs.forEach(c => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${c.cert_name || ''}</td>
                    <td>${c.cert_no || ''}</td>
                    <td><a href="#" style="color:var(--primary);">${c.file_count || 0}</a></td>
                    <td style="color:#f56c6c;">${c.start_date || ''}</td>
                    <td style="color:#f56c6c;">${c.end_date || ''}</td>
                    <td><span style="color:var(--primary);">${c.is_remind ? '是' : '否'}</span></td>
                    <td>
                        <button class="btn-action-outline" style="border-color:#409eff; color:#409eff;">编辑</button>
                        <button class="btn-action-outline danger">删除</button>
                    </td>
                `;
                certTbody.appendChild(tr);
            });
        }
    });
}

// Initialization
document.addEventListener("DOMContentLoaded", () => {
    fetchPersonnel();
});
