import { useState } from 'react';
import ConfirmPasswordModal from './ConfirmPasswordModal';
import ConfirmEmailModal from './ConfirmEmailModal';
import ForgotPasswordModal from './ForgotPasswordModal';
import OtpSentModal from './OtpSentModal';
import ResetPasswordModal from './ResetPasswordModal';
import ThankYouModal from './SuccessModal';

const PopupFlowController = ({ actionType }: { actionType: 'delete' | 'reset' | 'forgot' }) => {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => prev + 1);
  const closeFlow = () => setStep(0);

  if (step === 0) return null;

  switch (actionType) {
    case 'delete':
      if (step === 1) return <ConfirmPasswordModal onSuccess={nextStep} onFail={nextStep} />;
      if (step === 2) return <ConfirmEmailModal onConfirm={nextStep} />;
      if (step === 3) return <OtpSentModal onNext={nextStep} />;
      if (step === 4) return <ResetPasswordModal onNext={nextStep} />;
      if (step === 5) return <ConfirmPasswordModal onSuccess={nextStep} onFail={nextStep} />;
      if (step === 6) return <ThankYouModal onClose={closeFlow} />;
      break;

    case 'reset':
      if (step === 1) return <ConfirmPasswordModal onSuccess={nextStep} onFail={nextStep} />;
      if (step === 2) return <ConfirmEmailModal onConfirm={nextStep} />;
      if (step === 3) return <OtpSentModal onNext={nextStep} />;
      if (step === 4) return <ResetPasswordModal onNext={nextStep} />;
      if (step === 5) return <ThankYouModal onClose={closeFlow} />;
      break;

    case 'forgot':
      if (step === 1) return <ForgotPasswordModal onNext={nextStep} />;
      if (step === 2) return <OtpSentModal onNext={nextStep} />;
      if (step === 3) return <ResetPasswordModal onNext={nextStep} />;
      if (step === 4) return <ConfirmPasswordModal onSuccess={nextStep} onFail={nextStep} />;
      if (step === 5) return <ThankYouModal onClose={closeFlow} />;
      break;
  }

  return null;
};

export default PopupFlowController;
