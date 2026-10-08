const grades={A:4,'B+':3.5,B:3,'C+':2.5,C:2,F:0};

export function initGPA(){
	const tbody=document.querySelector('#courseRows');
	const gpa=document.querySelector('#gpaValue');
	const semesters=document.querySelector('#semesterRows');
	const cgpa=document.querySelector('#cgpaValue');
	let courseId=0;
	let semId=0;

	function totals(){
		let qualityPoints=0;
		let credits=0;
		tbody.querySelectorAll('tr').forEach(row=>{
			const courseCredits=Number(row.querySelector('.credits').value)||0;
			const points=grades[row.querySelector('.grade').value]??0;
			qualityPoints+=courseCredits*points;
			credits+=courseCredits;
			row.querySelector('.points').textContent=points.toFixed(1);
		});
		return {gpa:credits?qualityPoints/credits:0,credits};
	}

	function calc(){
		const current=totals();
		gpa.textContent=`${current.gpa.toFixed(2)} · ${current.credits.toFixed(1)} credit hours`;
		let weightedPoints=0;
		let totalCredits=0;
		semesters.querySelectorAll('.semester-row').forEach(row=>{
			const semesterGpa=Number(row.querySelector('.semester-gpa').value)||0;
			const semesterCredits=Number(row.querySelector('.semester-credits').value)||0;
			weightedPoints+=semesterGpa*semesterCredits;
			totalCredits+=semesterCredits;
		});
		cgpa.textContent=(totalCredits?weightedPoints/totalCredits:0).toFixed(2);
	}

	function addCourse(){
		courseId++;
		const row=document.createElement('tr');
		row.innerHTML=`<td><input aria-label="Course name" placeholder="Course ${courseId}"></td><td><input class="credits" aria-label="Credit hours" type="number" min="0" step="0.5" value="3"></td><td><select class="grade" aria-label="Grade">${Object.keys(grades).map(grade=>`<option>${grade}</option>`).join('')}</select></td><td class="points">4.0</td><td><button class="remove-btn" aria-label="Remove course">✕</button></td>`;
		row.querySelector('.remove-btn').onclick=()=>{row.remove();calc()};
		row.querySelectorAll('input,select').forEach(input=>input.oninput=calc);
		tbody.appendChild(row);
		calc();
	}

	function saveSemester(){
		const current=totals();
		if(!current.credits)return;
		semId++;
		const row=document.createElement('div');
		row.className='semester-row';
		row.innerHTML=`<span class="semester-name">Semester ${semId}</span><input class="semester-gpa" type="number" min="0" max="4" step="0.01" value="${current.gpa.toFixed(2)}" placeholder="GPA" aria-label="Semester ${semId} GPA"><input class="semester-credits" type="number" min="0" step="0.5" value="${current.credits}" placeholder="Credits" aria-label="Semester ${semId} total credits"><button class="remove-btn" aria-label="Remove semester">✕</button>`;
		row.querySelector('button').onclick=()=>{row.remove();calc()};
		row.querySelectorAll('input').forEach(input=>input.oninput=calc);
		semesters.appendChild(row);
		tbody.replaceChildren();
		addCourse();
		calc();
	}

	document.querySelector('#addCourse').onclick=addCourse;
	const addSemesterButton=document.querySelector('#addSemester');
	addSemesterButton.innerHTML='<i data-lucide="plus"></i> Save & add semester';
	addSemesterButton.onclick=saveSemester;
	if(window.lucide)window.lucide.createIcons();
	addCourse();
	addCourse();
}
