// ==================== SECURITY FEATURES ====================

// Correct PIN (Change this to your 6-digit PIN)
const CORRECT_PIN = "123456"; // ⚠️ अपना PIN यहाँ बदलें!

// Blocked IPs array
let blockedIPs = JSON.parse(localStorage.getItem('blockedIPs')) || [];

// Anti-Inspect Detection
function detectDevTools() {
    const devtools = {
        open: false,
        orientation: null
    };
    
    const threshold = 160;
    
    setInterval(() => {
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
            if (!devtools.open) {
                devtools.open = true;
                suspiciousActivity('DevTools Detected');
            }
        } else {
            devtools.open = false;
        }
    }, 500);

    // Console Detection
    (function() {
        const script = document.createElement('script');
        script.textContent = `
            (window.ondevtoolopen = function() {
                suspiciousActivity('DevTools Opened');
            })();
        `;
        document.head.appendChild(script);
    })();
}

// Suspicious Activity Handler
function suspiciousActivity(reason) {
    const userIP = getUserIP();
    if (!blockedIPs.includes(userIP)) {
        blockedIPs.push(userIP);
        localStorage.setItem('blockedIPs', JSON.stringify(blockedIPs));
    }
    
    document.getElementById('suspiciousAlert').classList.remove('hidden');
    document.body.innerHTML = '';
    
    // Send alert to server (if backend available)
    console.log(`🚨 IP Blocked: ${userIP} - Reason: ${reason}`);
    
    // Disable all functionality
    document.onkeydown = null;
    window.oncontextmenu = null;
}

// Get User IP (Client-side approximation)
function getUserIP() {
    return 'client-' + Math.random().toString(36).substr(2, 9);
}

// Anti-Right Click & F12
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I') || 
        (e.ctrlKey && e.shiftKey && e.key === 'C') || (e.ctrlKey && e.key === 'u')) {
        e.preventDefault();
        suspiciousActivity('Keyboard Shortcut Blocked');
    }
});

// ==================== BABY PROFILE DATA ====================
const babyData = {
    photo: "baby-placeholder.jpg",
    basic: {
        name: "आरव शर्मा",
        dob: "15/08/2023",
        age: "1 साल 3 महीने",
        weight: "10.2 kg",
        height: "75 cm",
        bloodGroup: "O+"
    },
    medical: {
        allergies: "दूध से एलर्जी",
        doctor: "डॉ. नेहा गुप्ता",
        hospital: "मैक्स हॉस्पिटल",
        lastCheckup: "20/11/2024"
    },
    growth: {
        birthWeight: "3.2 kg",
        month1: "4.1 kg",
        month6: "7.5 kg",
        month12: "9.8 kg"
    },
    vaccination: {
        bcg: "दिया गया - 16/08/2023",
        hepB: "दिया गया - 16/08/2023",
        opv0: "दिया गया - 16/08/2023",
        pentavalent1: "दिया गया - 15/11/2023"
    }
};

// ==================== MAIN FUNCTIONS ====================

function checkPin() {
    const pin = document.getElementById('pinInput').value;
    
    if (pin === CORRECT_PIN) {
        showProfile();
    } else {
        alert('❌ गलत PIN! कोशिश बंद करें।');
        suspiciousActivity('Wrong PIN');
        document.getElementById('pinInput').value = '';
    }
}

function showProfile() {
    document.getElementById('loginScreen').classList.remove('active');
    document.getElementById('profileScreen').classList.add('active');
    
    loadProfileData();
}

function loadProfileData() {
    // Load Photo
    document.getElementById('babyPhoto').src = babyData.photo;
    
    // Load Basic Info
    document.getElementById('basicInfo').innerHTML = `
        <div class="detail-item"><span>नाम:</span><strong>${babyData.basic.name}</strong></div>
        <div class="detail-item"><span>जन्म तारीख:</span><strong>${babyData.basic.dob}</strong></div>
        <div class="detail-item"><span>आयु:</span><strong>${babyData.basic.age}</strong></div>
        <div class="detail-item"><span>वजन:</span><strong>${babyData.basic.weight}</strong></div>
        <div class="detail-item"><span>लंबाई:</span><strong>${babyData.basic.height}</strong></div>
        <div class="detail-item"><span>ब्लड ग्रुप:</span><strong>${babyData.basic.bloodGroup}</strong></div>
    `;
    
    // Load Medical Info
    document.getElementById('medicalInfo').innerHTML = `
        <div class="detail-item"><span>एलर्जी:</span><strong>${babyData.medical.allergies}</strong></div>
        <div class="detail-item"><span>डॉक्टर:</span><strong>${babyData.medical.doctor}</strong></div>
        <div class="detail-item"><span>अस्पताल:</span><strong>${babyData.medical.hospital}</strong></div>
        <div class="detail-item"><span>आखिरी चेकअप:</span><strong>${babyData.medical.lastCheckup}</strong></div>
    `;
    
    // Load Growth Chart
    document.getElementById('growthInfo').innerHTML = `
        <div class="detail-item"><span>जन्म का वजन:</span><strong>${babyData.growth.birthWeight}</strong></div>
        <div class="detail-item"><span>1 महीना:</span><strong>${babyData.growth.month1}</strong></div>
        <div class="detail-item"><span>6 महीने:</span><strong>${babyData.growth.month6}</strong></div>
        <div class="detail-item"><span>12 महीने:</span><strong>${babyData.growth.month12}</strong></div>
    `;
    
    // Load Vaccination
    document.getElementById('vaccinationInfo').innerHTML = `
        <div class="detail-item"><span>BCG:</span><strong>${babyData.vaccination.bcg}</strong></div>
        <div class="detail-item"><span>Hep B:</span><strong>${babyData.vaccination.hepB}</strong></div>
        <div class="detail-item"><span>OPV 0:</span><strong>${babyData.vaccination.opv0}</strong></div>
        <div class="detail-item"><span>Pentavalent 1:</span><strong>${babyData.vaccination.pentavalent1}</strong></div>
    `;
}

function logout() {
    document.getElementById('profileScreen').classList.remove('active');
    document.getElementById('loginScreen').classList.add('active');
    document.getElementById('pinInput').value = '';
}

// Enter key support
document.getElementById('pinInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkPin();
    }
});

// Initialize Security
detectDevTools();
