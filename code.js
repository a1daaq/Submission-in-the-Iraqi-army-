document.addEventListener('DOMContentLoaded', function() {

  // 1. FAQ Toggle
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      const faqItem = this.parentElement;
      faqItem.classList.toggle('active');
    });
  });

  // 2. Terms and Conditions Modal
  const termsLink = document.getElementById('terms-link');
  const termsModal = document.getElementById('terms-modal');
  const closeButton = document.querySelector('.close-button');
  const closeTermsBtn = document.getElementById('close-terms');

  termsLink.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default link behavior
    termsModal.style.display = 'block';
  });

  closeButton.addEventListener('click', function() {
    termsModal.style.display = 'none';
  });

  closeTermsBtn.addEventListener('click', function() {
     termsModal.style.display = 'none';
  });

  // Close the modal if the user clicks outside of it
  window.addEventListener('click', function(event) {
    if (event.target == termsModal) {
      termsModal.style.display = 'none';
    }
  });

    // 3. Show minimum education
    const educationSelect = document.getElementById("education");
    const minEducationSpan = document.getElementById("min-education");

    // Function to get and display the minimum education
    function updateMinEducation() {
        const selectedOption = educationSelect.options[educationSelect.selectedIndex].text;
        minEducationSpan.textContent = selectedOption;
    }
    // Initial display and update on change
    updateMinEducation();
    educationSelect.addEventListener("change", updateMinEducation);

  // 4. Form Submission with Enhanced Validation and Progress Bar
  const form = document.getElementById('army-application');
  form.addEventListener('submit', function(event) {
    event.preventDefault();

    // --- Enhanced Validation ---
    let isValid = true;
    const fullName = document.getElementById('fullName').value.trim();
    const dob = document.getElementById('dob').value;
    const nationalId = document.getElementById('nationalId').value.trim();
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const email = document.getElementById('email').value.trim();
    const agreeTerms = document.getElementById('agreeTerms').checked;


    // Full Name Validation
    if (!fullName) {
      alert('يرجى إدخال اسمك الكامل.');
      isValid = false;
    }

    // Date of Birth Validation (18+ age)
      const dobDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - dobDate.getFullYear();
      const m = today.getMonth() - dobDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
          age--;
      }
      if (age < 18) {
          alert("يجب أن يكون عمرك 18 عامًا أو أكبر للتقديم.");
          isValid = false;
      }


    // National ID Validation (Example: Check if it's a 12-digit number)
     if (!/^\d{12}$/.test(nationalId)) {
        alert('يرجى إدخال رقم هوية وطنية صحيح مكون من 12 رقم.');
        isValid = false;
    }


    // Phone Number Validation (Example: Check if it's a 10-digit number starting with 0)
    if (!/^0\d{9}$/.test(phoneNumber)) {
      alert('يرجى إدخال رقم هاتف صحيح (10 أرقام ويبدأ بـ 0).');
      isValid = false;
    }

    // Email Validation (Optional, but if provided, check the format)
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('يرجى إدخال بريد إلكتروني صحيح.');
      isValid = false;
    }

    // Agree to Terms Check
    if (!agreeTerms) {
      alert('يجب الموافقة على الشروط والأحكام.');
      isValid = false;
    }

    if (!isValid) {
      return; // Stop submission if validation fails
    }


    // --- AJAX Request with Progress Bar ---
    const formData = new FormData(this);
    const progressBarContainer = document.querySelector('.progress-bar-container');
    const progressBar = document.getElementById('progress-bar');

     // Only show if there's an attachment
    if(document.getElementById('attachment').files.length > 0){
       progressBarContainer.style.display = 'block';
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'submit_application.php');

    xhr.upload.onprogress = function(event) {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        progressBar.style.width = percentComplete + '%';
        progressBar.setAttribute('aria-valuenow', percentComplete);
        progressBar.textContent = Math.round(percentComplete) + '%';
      }
    };

    xhr.onload = function() {
      progressBarContainer.style.display = 'none'; // Hide after completion
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          // Handle successful submission
          console.log('Success:', data);
          document.getElementById('submit-message').textContent = 'تم إرسال طلبك بنجاح. سوف نتصل بك قريبًا.';
          document.getElementById('submit-message').style.color = 'green';
          form.reset();
        } catch (error) {
           console.error('JSON Parse Error:', error);
           document.getElementById('submit-message').textContent = 'حدث خطأ أثناء معالجة الرد. يرجى المحاولة مرة أخرى.';
           document.getElementById('submit-message').style.color = 'red';
        }
      } else {
          console.error('Request failed with status:', xhr.status);
          document.getElementById('submit-message').textContent = 'حدث خطأ أثناء إرسال طلبك. يرجى المحاولة مرة أخرى. رمز الخطأ: ' + xhr.status;
          document.getElementById('submit-message').style.color = 'red';
      }
    };

      xhr.onerror = function() {
          progressBarContainer.style.display = 'none';
          document.getElementById('submit-message').textContent = 'حدث خطأ في الشبكة. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.';
          document.getElementById('submit-message').style.color = 'red';
      };


    xhr.send(formData);
  });

});