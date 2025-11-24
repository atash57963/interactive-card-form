
document.addEventListener('DOMContentLoaded', function () {
  const nameInput = document.querySelector('input[name="name"]');
  const numberInput = document.querySelector('input[name="number"]');
  const mmInput = document.querySelector('input[name="mm"]');
  const yyInput = document.querySelector('input[name="yy"]');
  const cvcInput = document.querySelector('input[name="cvc"]');

  const cardName = document.querySelector('.card-name');
  const cardNumber = document.querySelector('.card-number');
  const cardExp = document.querySelector('.card-exp');
  const cardCvc = document.querySelector('.signature-line');
  const cardBrand = document.querySelector('.card-brand');

  function findErrorEl(input) {
    if (!input) return null;
    const lbl = input.closest && input.closest('label');
    return lbl ? lbl.querySelector('.error') : null;
  }

  const mmError = findErrorEl(mmInput);
  const cvcError = findErrorEl(cvcInput);
  const nameError = findErrorEl(nameInput);
  const numberError = findErrorEl(numberInput);

  function updateName() {
    const v = (nameInput.value || '').trim();
    if (cardName) cardName.textContent = v ? v.toUpperCase() : 'XXXXXX XXXXXX';
    if (v && nameError) {
      nameError.textContent = '';
    }
    if (v && nameInput) nameInput.classList.remove('input-error');
  }

  function formatCardNumber(raw) {
    const s = (raw || '').replace(/\s+/g, '');
    if (!s) return '0000 0000 0000 0000';
    return s.replace(/(.{4})/g, '$1 ').trim();
  }

  function updateNumber() {
    const formatted = formatCardNumber(numberInput.value);
    if (cardNumber) cardNumber.textContent = formatted || '';
    const digits = numberInput ? (numberInput.value || '').replace(/\s+/g, '') : '';
    if (digits.length === 16) {
      if (numberError) numberError.textContent = '';
      if (numberInput) numberInput.classList.remove('input-error');
    }
    if (cardBrand) {
      let brand = '';
      let cls = '';
      if (digits && digits.length > 0) {
        const first = digits.charAt(0);
        if (first === '4') { brand = 'VISA'; cls = 'visa'; }
        else if (first === '5') { brand = 'MASTERCARD'; cls = 'mastercard'; }
        else if (first === '6') { brand = 'Discover'; cls = 'discover'; }
        else if (first === '3') { brand = 'American Express'; cls = 'amex'; }
      }
      cardBrand.textContent = brand;
      cardBrand.classList.remove('visa','mastercard','discover','amex','empty');
      if (!brand) cardBrand.classList.add('empty');
      else cardBrand.classList.add(cls);
    }
  }

  function validateNumber(numRaw) {
    if (!numberInput) return true;
    const digits = (numRaw || '').replace(/\s+/g, '');
    if (!digits) {
      if (numberError) numberError.textContent = "Can't be blank";
      numberInput.classList.add('input-error');
      return false;
    }
    if (digits.length !== 16) {
      if (numberError) numberError.textContent = 'Card number must be 16 digits';
      numberInput.classList.add('input-error');
      return false;
    }
    if (numberError) numberError.textContent = '';
    numberInput.classList.remove('input-error');
    return true;
  }

  function pad2(v) {
    return v ? (v.length === 1 ? '0' + v : v) : '00';
  }

  function updateExp() {
    const mmRaw = (mmInput.value || '').replace(/\D/g, '').slice(0,2);
    const yyRaw = (yyInput.value || '').replace(/\D/g, '').slice(0,2);
    const mm = pad2(mmRaw);
    const yy = pad2(yyRaw);
    if (cardExp) cardExp.textContent = `${mm}/${yy}`;
    validateMonth(mmRaw);
    if (mmRaw || yyRaw) {
      if (mmError) mmError.textContent = '';
      if (mmInput) mmInput.classList.remove('input-error');
      if (yyInput) yyInput.classList.remove('input-error');
    }
  }

  function validateMonth(mmRaw) {
    if (!mmRaw) {
      if (mmError) mmError.textContent = '';
      if (mmInput) mmInput.classList.remove('input-error');
      return true;
    }
    const val = parseInt(mmRaw, 10);
    if (isNaN(val) || val < 1 || val > 12) {
      if (mmError) mmError.textContent = 'Invalid month — must be 01 to 12';
      if (mmInput) mmInput.classList.add('input-error');
      return false;
    }
    if (mmError) mmError.textContent = '';
    if (mmInput) mmInput.classList.remove('input-error');
    return true;
  }

  function updateCvc() {
    const v = (cvcInput && cvcInput.value ? cvcInput.value : '').replace(/\D/g, '').slice(0,3);
    if (cardCvc) cardCvc.textContent = v || '000';
    validateCvc(v);
  }

  function validateCvc(vRaw) {
    if (!vRaw) {
      if (cvcError) cvcError.textContent = '';
      if (cvcInput) cvcInput.classList.remove('input-error');
      return false;
    }
    if (vRaw.length !== 3) {
      cvcError.textContent = 'CVC must be 3 digits';
      cvcInput.classList.add('input-error');
      return false;
    }
    if (cvcError) cvcError.textContent = '';
    if (cvcInput) cvcInput.classList.remove('input-error');
    return true;
  }

  function validateRequired() {
    let ok = true;
    
    if (!(nameInput.value || '').trim()) {
      nameError.textContent = "Can't be blank";
      nameInput.classList.add('input-error');
      ok = false;
    }
    if (!(numberInput.value || '').replace(/\s+/g, '').length) {
      numberError.textContent = "Can't be blank";
      numberInput.classList.add('input-error');
      ok = false;
    }
    const mmRaw = (mmInput.value || '').replace(/\D/g, '').slice(0,2);
    const yyRaw = (yyInput.value || '').replace(/\D/g, '').slice(0,2);
    if (!mmRaw || !yyRaw) {
      mmError.textContent = "Can't be blank";
      if (!mmRaw) mmInput.classList.add('input-error');
      if (!yyRaw) yyInput.classList.add('input-error');
      ok = false;
    }
    const cvcRaw = (cvcInput.value || '').replace(/\D/g, '').slice(0,4);
    if (!cvcRaw) {
      cvcError.textContent = "Can't be blank";
      cvcInput.classList.add('input-error');
      ok = false;
    }
    return ok;
  }

  function numericInputHandler(e) {
    const name = this.getAttribute && this.getAttribute('name');
    if (name === 'number') {
      const raw = (this.value || '').replace(/[^0-9]/g, '');
      const limited = raw.slice(0, 16);
      if (!limited) this.value = '';
      else this.value = formatCardNumber(limited);
    } else if (name === 'mm') {
      let digits = (this.value || '').replace(/\D/g, '').slice(0, 2);
      if (digits.length === 2) {
        const val = parseInt(digits, 10);
        if (isNaN(val) || val < 1 || val > 12) {
          digits = digits.slice(0, 1);
        }
      }
      this.value = digits;
    } else if (name === 'yy') {
      this.value = (this.value || '').replace(/\D/g, '').slice(0, 2);
    } else if (name === 'cvc') {
      this.value = (this.value || '').replace(/\D/g, '').slice(0, 3);
    } else {
      const allowed = /\D/g;
      this.value = this.value.replace(allowed, '');
    }
  }

  if (nameInput) nameInput.addEventListener('input', updateName);
  if (numberInput) numberInput.addEventListener('input', function (e) { numericInputHandler.call(this, e); updateNumber(); });
  if (mmInput) mmInput.addEventListener('input', function (e) { numericInputHandler.call(this, e); updateExp(); });
  if (yyInput) yyInput.addEventListener('input', function (e) { numericInputHandler.call(this, e); updateExp(); });
  if (cvcInput) cvcInput.addEventListener('input', function (e) { numericInputHandler.call(this, e); updateCvc(); });

  updateName();
  updateNumber();
  updateExp();
  updateCvc();

  const card3d = document.getElementById('card-3d');
  if (card3d) {
    card3d.addEventListener('click', function (e) {
      card3d.classList.toggle('flipped');
      const pressed = card3d.classList.contains('flipped');
      card3d.setAttribute('aria-pressed', pressed ? 'true' : 'false');
    });
    card3d.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card3d.classList.toggle('flipped');
        const pressed = card3d.classList.contains('flipped');
        card3d.setAttribute('aria-pressed', pressed ? 'true' : 'false');
      }
    });
  }

  const form = document.querySelector('.card-form');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      const okRequired = validateRequired();
      if (!okRequired) {
        if (!(nameInput.value || '').trim()) { nameInput.focus(); return; }
        if (!((numberInput.value || '').replace(/\s+/g, '').length)) { numberInput.focus(); return; }
        const mmRaw = (mmInput.value || '').replace(/\D/g, '').slice(0,2);
        const yyRaw = (yyInput.value || '').replace(/\D/g, '').slice(0,2);
        if (!mmRaw) { mmInput.focus(); return; }
        if (!yyRaw) { yyInput.focus(); return; }
        if (!((cvcInput.value || '').replace(/\D/g, '').length)) { cvcInput.focus(); return; }
      }

      const numRaw2 = (numberInput.value || '').replace(/\s+/g, '');
      const okNumber = validateNumber(numRaw2);
      if (!okNumber) { numberInput.focus(); return; }
      const mmRaw2 = (mmInput.value || '').replace(/\D/g, '').slice(0,2);
      const okMonth = validateMonth(mmRaw2);
      const cvcRaw2 = (cvcInput.value || '').replace(/\D/g, '').slice(0,4);
      const okCvc = validateCvc(cvcRaw2);
      if (!okMonth) { mmInput.focus(); return; }
      if (!okCvc) { cvcInput.focus(); return; }
      alert('Form submitted — values mirrored on the card.');
    });
  }
});
