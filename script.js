// State management for all inputs
const state = {
    'and-a': false,
    'and-b': false,
    'or-a': false,
    'or-b': false,
    'not-a': false,
    'if-a': false,
    'elif-a': false,
    'elif-b': false
};

// Main toggle function called when a switch is clicked
function toggleInput(id) {
    // 1. Toggle the state
    state[id] = !state[id];
    const val = state[id];

    // 2. Update the toggle UI
    const toggleEl = document.getElementById(id);
    const labelEl = toggleEl.querySelector('.toggle-label');
    
    if (val) {
        toggleEl.classList.add('active');
        labelEl.textContent = 'True';
    } else {
        toggleEl.classList.remove('active');
        labelEl.textContent = 'False';
    }

    // 3. Re-evaluate and update the corresponding operator section
    if (id.startsWith('and')) {
        updateAnd();
    } else if (id.startsWith('or')) {
        updateOr();
    } else if (id.startsWith('not')) {
        updateNot();
    } else if (id.startsWith('if')) {
        updateIf();
    } else if (id.startsWith('elif')) {
        updateElif();
    }
}

// Update functions for each operator
function updateAnd() {
    const a = state['and-a'];
    const b = state['and-b'];
    const result = a && b;

    updateExpressionDisplay('and-expr-a', a);
    updateExpressionDisplay('and-expr-b', b);
    updateOutputDisplay('and-output', result);
    updateCodeBlock('and-code', 'and', a, b, result);
}

function updateOr() {
    const a = state['or-a'];
    const b = state['or-b'];
    const result = a || b;

    updateExpressionDisplay('or-expr-a', a);
    updateExpressionDisplay('or-expr-b', b);
    updateOutputDisplay('or-output', result);
    updateCodeBlock('or-code', 'or', a, b, result);
}

function updateNot() {
    const a = state['not-a'];
    const result = !a;

    updateExpressionDisplay('not-expr-a', a);
    updateOutputDisplay('not-output', result);
    updateCodeBlock('not-code', 'not', a, null, result);
}

function updateIf() {
    const a = state['if-a'];
    
    updateExpressionDisplay('if-expr-a', a);
    
    const container = document.getElementById('if-output');
    const span = container.querySelector('span');
    span.textContent = a ? 'Executed' : 'Skipped';
    span.className = a ? 'val-true' : 'val-false';
    
    container.style.transform = 'scale(1.1)';
    setTimeout(() => { container.style.transform = 'scale(1)'; }, 150);
    
    const el = document.getElementById('if-code');
    const aStr = a ? 'True' : 'False';
    el.innerHTML = `condition = <span class="code-boolean">${aStr}</span>
<span class="code-keyword">if</span> condition:
    <span class="code-func">print</span>(<span class="code-string">"Executed"</span>) <span class="code-comment"># ${a ? 'Output: Executed' : 'Skipped'}</span>`;
}

function updateElif() {
    const a = state['elif-a'];
    const b = state['elif-b'];
    
    updateExpressionDisplay('elif-expr-a', a);
    updateExpressionDisplay('elif-expr-b', b);
    
    let resultText = '';
    let resultClass = '';
    if (a) {
        resultText = 'If Executed';
        resultClass = 'val-true';
    } else if (b) {
        resultText = 'Elif Executed';
        resultClass = 'val-true';
    } else {
        resultText = 'Else Executed';
        resultClass = 'val-false';
    }
    
    const container = document.getElementById('elif-output');
    const span = container.querySelector('span');
    span.textContent = resultText;
    span.className = resultClass;
    
    container.style.transform = 'scale(1.1)';
    setTimeout(() => { container.style.transform = 'scale(1)'; }, 150);
    
    const el = document.getElementById('elif-code');
    const aStr = a ? 'True' : 'False';
    const bStr = b ? 'True' : 'False';
    el.innerHTML = `cond1 = <span class="code-boolean">${aStr}</span>
cond2 = <span class="code-boolean">${bStr}</span>
<span class="code-keyword">if</span> cond1:
    <span class="code-func">print</span>(<span class="code-string">"If Executed"</span>)
<span class="code-keyword">elif</span> cond2:
    <span class="code-func">print</span>(<span class="code-string">"Elif Executed"</span>)
<span class="code-keyword">else</span>:
    <span class="code-func">print</span>(<span class="code-string">"Else Executed"</span>) <span class="code-comment"># Output: ${resultText}</span>`;
}

// Navigation logic
function showSection(sectionId) {
    document.getElementById('section-logical').classList.add('hidden');
    document.getElementById('section-control').classList.add('hidden');
    document.getElementById('btn-logical').classList.remove('active');
    document.getElementById('btn-control').classList.remove('active');
    
    document.getElementById('section-' + sectionId).classList.remove('hidden');
    document.getElementById('btn-' + sectionId).classList.add('active');
}

// Helper to update the text and color in the expression area
function updateExpressionDisplay(elementId, value) {
    const el = document.getElementById(elementId);
    el.textContent = value ? 'True' : 'False';
    el.className = value ? 'val-true' : 'val-false';
}

// Helper to update the final output box
function updateOutputDisplay(containerId, result) {
    const container = document.getElementById(containerId);
    const span = container.querySelector('span');
    
    span.textContent = result ? 'True' : 'False';
    span.className = result ? 'val-true' : 'val-false';
    
    // Add a little pop animation when the result changes
    container.style.transform = 'scale(1.1)';
    setTimeout(() => {
        container.style.transform = 'scale(1)';
    }, 150);
}

// Helper to update the python code block
function updateCodeBlock(elementId, op, a, b, result) {
    const el = document.getElementById(elementId);
    const aStr = a ? 'True' : 'False';
    const bStr = b ? 'True' : 'False';
    const resStr = result ? 'True' : 'False';
    
    if (op === 'not') {
        el.innerHTML = `a = <span class="code-boolean">${aStr}</span>
result = <span class="code-keyword">not</span> a
<span class="code-func">print</span>(result) <span class="code-comment"># Output: ${resStr}</span>`;
    } else {
        el.innerHTML = `a = <span class="code-boolean">${aStr}</span>
b = <span class="code-boolean">${bStr}</span>
result = a <span class="code-keyword">${op}</span> b
<span class="code-func">print</span>(result) <span class="code-comment"># Output: ${resStr}</span>`;
    }
}
