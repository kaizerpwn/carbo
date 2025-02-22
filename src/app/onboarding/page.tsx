'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import WelcomeStep from '../../components/onboarding/welcome-step';
import TransportStep from '../../components/onboarding/transport-step';
import ProgressBar from '@/components/Progresbar';
import ReusableBags from '../../components/onboarding/reusable-bags';
import RecycleBehave from '../../components/onboarding/recycle-behave';
import CompletionPage from '../../components/onboarding/finish-page';
import { useAuth } from '@/context/AuthContext';

export default function OnBoardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const { setOnboardingData } = useAuth();
  const router = useRouter();

  const totalSteps = 4;

  const progress = (currentStep / (totalSteps - 1)) * 100;

  const handleContinue = (data: any) => {
    setOnboardingData((prev: any) => ({ ...prev, ...data }));
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      router.push('/sign-up');
    }
  };

  return (
    <div className='min-h-screen bg-backgroundDark flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        <div className='h-[10px]'>
          {progress == 0 ? <></> : <ProgressBar progress={progress} />}
        </div>

        {currentStep === 0 ? (
          <WelcomeStep onContinue={handleContinue} />
        ) : currentStep === 1 ? (
          <TransportStep onContinue={handleContinue} />
        ) : currentStep === 2 ? (
          <ReusableBags onContinue={handleContinue} />
        ) : currentStep === 3 ? (
          <RecycleBehave onContinue={handleContinue} />
        ) : (
          <CompletionPage />
        )}
      </div>
    </div>
  );
}
