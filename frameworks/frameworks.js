/* --- FRAMEWORKS CONTROLLER --- */
const Frameworks = {
    manifest: [
        { file: "cntnt01.01.html", label: "intro", title: "frameworks overview" },
        { file: "cntnt01.02.html", label: "installation", title: "setting up prsnt" },
        { file: "cntnt01.03.html", label: "logic", title: "how it works" },
        { file: "cntnt01.04.html", label: "deployment", title: "going live" }
    ],
    currentIndex: 0,

    async init() {
        // Ensure the containers exist before running
        if (!document.getElementById('link-button-container')) {
            console.error("Frameworks Error: 'link-button-container' not found in HTML.");
            return;
        }
        this.renderSidebar();
        await this.load(0);
    },

    renderSidebar() {
        const container = document.getElementById('link-button-container');
        container.innerHTML = this.manifest.map((item, index) => `
            <button onclick="Frameworks.load(${index})" 
                    class="link-item-btn ${index === this.currentIndex ? 'active' : 'inactive'}"
                    id="btn-${index}">
                ${item.label}
            </button>
        `).join('');
    },

    async load(index) {
        const item = this.manifest[index];
        const contentArea = document.getElementById('sbcnt-content-area');
        const headerArea = document.getElementById('view-title-text');

        try {
            console.log(`Attempting to load: ${item.file}`); // Debug log
            const response = await fetch(item.file);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const html = await response.text();
            
            // 1. Update Content
            contentArea.innerHTML = html;
            
            // 2. Update Header
            headerArea.innerText = item.title;

            // 3. Update UI State (Safer class handling)
            document.querySelectorAll('.link-item-btn').forEach(b => {
                b.classList.remove('active');
                b.classList.add('inactive');
            });
            
            const activeBtn = document.getElementById(`btn-${index}`);
            if (activeBtn) {
                activeBtn.classList.remove('inactive');
                activeBtn.classList.add('active');
            }
            
            this.currentIndex = index;
        } catch (e) {
            console.error("Frameworks Load Error:", e);
            contentArea.innerHTML = `
                <div style="padding: 20px; border: 1px dashed #f87171; color: #ef4444;">
                    <strong>Error loading content</strong><br>
                    File: ${item.file}<br>
                    Reason: ${e.message}
                </div>`;
        }
    },

    next() {
        let n = (this.currentIndex + 1) % this.manifest.length;
        this.load(n);
    },

    prev() {
        let n = (this.currentIndex - 1 + this.manifest.length) % this.manifest.length;
        this.load(n);
    }
};
