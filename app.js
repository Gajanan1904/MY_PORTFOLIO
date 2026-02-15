document.addEventListener('DOMContentLoaded', () => {
    // ===== NAVBAR SCROLL =====
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        // Navbar background
        navbar.classList.toggle('scrolled', window.scrollY > 60);

        // Active link highlighting
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 120;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // ===== HAMBURGER MENU =====
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinksContainer.classList.toggle('open');
    });

    navLinksContainer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinksContainer.classList.remove('open');
        });
    });

    // ===== SCROLL REVEAL =====
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // ===== PROJECT MODALS =====
    const projectData = [
        {
            title: 'Attrition Risk & Workforce Segmentation Using ML',
            problem: 'Organizations lose significant revenue to unplanned employee attrition. HR teams lacked a data-driven framework to proactively identify at-risk employees and segment workforce performance, resulting in reactive and costly retention strategies.',
            data: '<strong>Source:</strong> Internal HR employee dataset<br><strong>Structure:</strong> Multi-feature employee records including performance, satisfaction, tenure, and demographic fields<br><strong>Processing:</strong> Missing value treatment, outlier handling, feature encoding, and optimization',
            methodology: 'Data Cleaning & Preprocessing → Exploratory Data Analysis → Feature Engineering & Encoding → Model Building (Logistic Regression, KNN, Decision Tree, XGBoost) → Model Evaluation & Optimization → SQL-Driven Analytics → Power BI Dashboard Development',
            tools: ['Python', 'Pandas', 'Scikit-learn', 'XGBoost', 'Matplotlib', 'Seaborn', 'SQL', 'Power BI'],
            insights: [
                '92% classification accuracy achieved in identifying attrition-prone employees',
                'Key attrition drivers identified: overtime frequency, job satisfaction scores, and years since last promotion',
                'Low-performance employee clusters isolated through segmentation analysis',
                'Model training efficiency improved by 40% through optimized preprocessing pipelines'
            ],
            impact: [
                'Reduced manual HR analysis workload by 60%',
                'Accelerated decision-making turnaround by 30%',
                'Enabled proactive retention strategies, potentially saving $50K–$200K annually in replacement costs',
                'Delivered interactive Power BI dashboards for ongoing workforce monitoring'
            ]
        },
        {
            title: 'Data-Driven Churn Prediction with ML, SQL & Power BI',
            problem: 'Customer churn was being identified only after occurrence, making retention efforts reactive and costly. The business needed a predictive framework to flag at-risk customers before they churned, enabling timely and targeted intervention.',
            data: '<strong>Source:</strong> Business customer/employee dataset<br><strong>Structure:</strong> Multi-dimensional records with behavioral, transactional, and performance attributes<br><strong>Processing:</strong> Null value imputation, anomaly treatment, categorical transformation',
            methodology: 'Data Quality Engineering → Feature Transformation & Encoding → Gradient Boosted Model Training (XGBoost) → Cohort Segmentation Analysis → SQL Analytical Queries → Power BI Visual Analytics',
            tools: ['Python', 'Pandas', 'Scikit-learn', 'XGBoost', 'MySQL', 'Power BI'],
            insights: [
                '92% prediction accuracy achieved in classifying churn-risk customers',
                'High-risk cohorts isolated using gradient boosted decision trees',
                'Behavioral patterns linked to churn: low engagement frequency, declining satisfaction trends',
                '40% faster model convergence through rigorous data quality engineering'
            ],
            impact: [
                'Reduced manual evaluation effort by 60%',
                'Improved decision turnaround speed by 30%',
                'Enabled proactive retention campaigns projected to reduce churn by 15–25%',
                'SQL-powered analytical layer provided self-service insights for business stakeholders'
            ]
        },
        {
            title: 'EDU_HUB — Personalized E-Learning Platform',
            problem: 'Existing e-learning platforms suffered from high page latency, poor cross-device compatibility, and one-size-fits-all content delivery — leading to low student engagement and suboptimal learning outcomes.',
            data: '<strong>Source:</strong> Student interaction data, course catalog, quiz performance<br><strong>Structure:</strong> User profiles, course modules, assessment records<br><strong>Architecture:</strong> Client-server with Django + PHP hybrid backend',
            methodology: 'Requirements Analysis → Frontend Performance Engineering → Backend API Integration (Django + PHP) → Interactive Assessment Module Development → UX Standardization & Accessibility Compliance → Cross-Device Testing',
            tools: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'Python Django', 'PHP', 'Font Awesome', 'GitHub Actions'],
            insights: [
                'Achieved 50% reduction in page load latency through lightweight frontend architecture',
                'Modular CSS framework enabled consistent brand identity across 15+ pages',
                'Custom quiz system with real-time scoring increased student interaction by 40%',
                'Accessibility compliance achieved across all major browsers and device types'
            ],
            impact: [
                'Won 1st place at HACK-IOT 2024 among 450+ teams',
                '50% improvement in page load speed vs. benchmark platforms',
                'Platform architecture scalable to support 1,000+ concurrent users',
                'Recognized for commitment to accessibility standards and inclusive design'
            ]
        },
        {
            title: 'FinTrack Pro — CLI Finance Manager',
            problem: 'Individuals lack structured tools to track daily expenses, monitor budgets, and identify spending patterns. Manual tracking in spreadsheets is error-prone and provides no automated alerts or category-level analytics.',
            data: '<strong>Source:</strong> User-generated financial transactions<br><strong>Tables:</strong> Categories, Expenses, Subscriptions, Budgets (4-table relational schema)<br><strong>Storage:</strong> Persistent SQLite database with ORM-based operations',
            methodology: 'Database Schema Design → SQLAlchemy ORM Implementation → CRUD Operations Development → Report Generation (SQL JOIN + GROUP BY) → Budget Alert System → CLI Interface Design',
            tools: ['Python', 'SQLite', 'SQLAlchemy ORM', 'Raw SQL', 'CLI'],
            insights: [
                'Relational 4-table schema supports comprehensive financial data modeling',
                'Category-wise expense reports reveal top spending areas and trends',
                'Automated budget alerts trigger when monthly spending exceeds configured limits',
                'ORM + raw SQL hybrid approach balances development speed with query performance'
            ],
            impact: [
                'Eliminates manual spreadsheet tracking, reducing data entry errors by ~80%',
                'Real-time budget monitoring enables proactive financial discipline',
                'Category analytics support data-driven personal spending optimization',
                'Modular architecture enables future extension to web/mobile interfaces'
            ]
        }
    ];

    // Open modal
    document.querySelectorAll('.project-expand').forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            openModal(index);
        });
    });

    document.querySelectorAll('.project-card').forEach((card, index) => {
        card.addEventListener('click', () => openModal(index));
    });

    function openModal(index) {
        const data = projectData[index];
        const modal = document.getElementById('projectModal');
        const body = document.getElementById('modalBody');

        body.innerHTML = `
      <h2>${data.title}</h2>
      <div class="modal-section">
        <h4>📋 Business Problem</h4>
        <p>${data.problem}</p>
      </div>
      <div class="modal-section">
        <h4>📊 Data</h4>
        <p>${data.data}</p>
      </div>
      <div class="modal-section">
        <h4>⚙️ Methodology</h4>
        <p>${data.methodology}</p>
      </div>
      <div class="modal-section">
        <h4>🛠 Tools Used</h4>
        <div class="modal-tools">
          ${data.tools.map(t => `<span>${t}</span>`).join('')}
        </div>
      </div>
      <div class="modal-section">
        <h4>💡 Key Insights</h4>
        <ul>
          ${data.insights.map(i => `<li>${i}</li>`).join('')}
        </ul>
      </div>
      <div class="modal-section">
        <h4>📈 Business Impact</h4>
        <div class="modal-impact">
          <ul>
            ${data.impact.map(i => `<li>${i}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close modal
    document.querySelector('.modal-close').addEventListener('click', closeModal);
    document.getElementById('projectModal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    function closeModal() {
        document.getElementById('projectModal').classList.remove('active');
        document.body.style.overflow = '';
    }
});
