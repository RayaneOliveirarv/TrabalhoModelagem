// ============================================
//  Funções de Validação Customizadas
// Valida campos de formulários com regras específicas
// ============================================

// Regras de validação centralizadas
export const validationRules = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Email inválido',
  },
  password: {
    minLength: 6,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
    message: 'A senha deve ter no mínimo 6 caracteres, incluindo letra maiúscula, minúscula e número',
    messageSimple: 'A senha deve ter no mínimo 6 caracteres',
  },
  cpf: {
    pattern: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
    message: 'CPF inválido (formato: 000.000.000-00)',
  },
  cnpj: {
    pattern: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
    message: 'CNPJ inválido (formato: 00.000.000/0000-00)',
  },
  phone: {
    pattern: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
    message: 'Telefone inválido (formato: (00) 00000-0000)',
  },
  required: {
    message: 'Este campo é obrigatório',
  },
};

// Valida formato de email
export const validateEmail = (email: string): string | null => {
  if (!email) {
    return validationRules.required.message;
  }
  if (!validationRules.email.pattern.test(email)) {
    return validationRules.email.message;
  }
  return null;
};

//  Valida senha (com opção de validação estrita)
export const validatePassword = (password: string, strict: boolean = false): string | null => {
  if (!password) {
    return validationRules.required.message;
  }
  if (password.length < validationRules.password.minLength) {
    return validationRules.password.messageSimple;
  }
  if (strict && !validationRules.password.pattern.test(password)) {
    return validationRules.password.message;
  }
  return null;
};

// Valida se senha e confirmação coincidem
export const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
  if (!confirmPassword) {
    return validationRules.required.message;
  }
  if (password !== confirmPassword) {
    return 'As senhas não coincidem';
  }
  return null;
};

// Valida CPF básico (formato e dígitos)
export const validateCPF = (cpf: string): string | null => {
  if (!cpf) {
    return validationRules.required.message;
  }
  
  // Remove formatação
  const cleanCPF = cpf.replace(/\D/g, '');
  
  if (cleanCPF.length !== 11) {
    return validationRules.cpf.message;
  }
  
  // Validação básica de CPF (verifica dígitos repetidos)
  if (/^(\d)\1{10}$/.test(cleanCPF)) {
    return 'CPF inválido';
  }
  
  return null;
};

//  Valida CNPJ básico
export const validateCNPJ = (cnpj: string): string | null => {
  if (!cnpj) {
    return validationRules.required.message;
  }
  
  // Remove formatação
  const cleanCNPJ = cnpj.replace(/\D/g, '');
  
  if (cleanCNPJ.length !== 14) {
    return validationRules.cnpj.message;
  }
  
  return null;
};

export const validateRequired = (value: string): string | null => {
  if (!value || value.trim() === '') {
    return validationRules.required.message;
  }
  return null;
};

// Formata CPF automaticamente (000.000.000-00)
export const formatCPF = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
  if (match) {
    return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
  }
  return cleaned;
};

// Formata CNPJ automaticamente (00.000.000/0000-00)
export const formatCNPJ = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/);
  if (match) {
    return `${match[1]}.${match[2]}.${match[3]}/${match[4]}-${match[5]}`;
  }
  return cleaned;
};

//Formata telefone automaticamente ((00) 00000-0000)
export const formatPhone = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length <= 10) {
    const match = cleaned.match(/^(\d{2})(\d{4})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
  } else {
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
  }
  return cleaned;
};
