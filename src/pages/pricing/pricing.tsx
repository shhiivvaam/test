import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, User } from '@firebase/auth';


import { auth } from '../../firebase/firebase';
import {
  //standard
  createStandardMonthlyCheckoutSession,
  createStandardMonthlyINRCheckoutSession,
  createStandardYearlyCheckoutSession,
  createStandardYearlyINRCheckoutSession,
  //prremium
  createPremiumMonthlyCheckoutSession,
  createPremiumMonthlyINRCheckoutSession,
  createPremiumYearlyCheckoutSession,
  createPremiumYearlyINRCheckoutSession
} from '../../utils/create-checkout-session';
import withLoading from '../../hoc/loading/loading';
import useGeoInfo from '../../hooks/useGeoInfo';
import { AUTH_PREFIX_PATH } from '../../configs/app-configs';

type PricingPlanProps = {
  setLoading?: (isLoading: boolean) => void;
};

const plans = [
  {
    name: 'Basic',
    price: {
      monthly: {
        usd: 0,
        inr: 0
      }, 
      annually: {
        usd: 0,
        inr: 0
      }
    },
    discretion: 'Best for starters',
    features: ['Unlimited tasks and edits', 'Multi device sync: 2'],
  },
  {
    name: 'Standard',
    price: {
      monthly: {
        usd: 1.99,
        inr: 69.99
      }, 
      annually: {
        usd: 10.99,
        inr: 499.99
      }
    },
    discretion: 'Best for growing teams',
    features: ['Unlimited tasks and edits', 'Multi device sync: 4', 'Workspace: 4', 'Members: 7', 'Edit section name'],
  },
  {
    name: 'Premium',
    price: {
      monthly: {
        usd: 2.99,
        inr: 79.99
      }, 
      annually: {
        usd: 12.99,
        inr: 699.99
      }
    },
    discretion: 'Best for enterprise level',
    features: ['Unlimited tasks and edits', 'Multi device sync: 5+', 'Workspace: 5+', 'Members: 11', 'Edit section name', 'Servers are expensive and you can support us by buying premium ;)'],
  },
];

const PricingPlan = ({ setLoading }: PricingPlanProps) => {
  const navigate = useNavigate();

  const { countryName } = useGeoInfo();

  const [billPlan] = useState<string>('monthly');
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      }
    });

    return () => unsubscribe();
  }, []);

  const onStandardSub = (): void => {
    if (typeof user !== 'undefined') {
      setLoading!(true)
      if (billPlan === 'monthly') {
        createStandardMonthlyCheckoutSession(user.uid)
      } else {
        createStandardYearlyCheckoutSession(user.uid);
      }
    } else {
      navigate(`${AUTH_PREFIX_PATH}/login`, {
        state: {
          showSignInToast: true,
        }
      });
    }
  };

  const onStandardINRSub = (): void => {
    if (typeof user !== 'undefined') {
      setLoading!(true);
      if (billPlan === 'monthly') {
        createStandardMonthlyINRCheckoutSession(user.uid)
      } else {
        createStandardYearlyINRCheckoutSession(user.uid);
      }
    } else {
      navigate(`${AUTH_PREFIX_PATH}/login`, {
        state: {
          showSignInToast: true,
        }
      });
    }
  }

  const onPremiumSub = (): void => {
    if (typeof user !== 'undefined') {
      setLoading!(true)
      if (billPlan === 'monthly') {
        createPremiumMonthlyCheckoutSession(user.uid)
      } else {
        createPremiumYearlyCheckoutSession(user.uid);
      }
    } else {
      navigate(`${AUTH_PREFIX_PATH}/login`, {
        state: {
          showSignInToast: true,
        }
      });
    }
  };

  const onPremiumINRSub = (): void => {
    if (typeof user !== 'undefined') {
      setLoading!(true)
      if (billPlan === 'monthly') {
        createPremiumMonthlyINRCheckoutSession(user.uid)
      } else {
        createPremiumYearlyINRCheckoutSession(user.uid);
      }
    } else {
      navigate(`${AUTH_PREFIX_PATH}/login`, {
        state: {
          showSignInToast: true,
        }
      });
    }
  };

  const onSubscribe = (plan: { name: string }): void => {
    if (plan.name === 'Standard') {
      if (countryName === 'India') {
        onStandardINRSub()
      } else {
        onStandardSub();
      }
    } else if (plan.name === 'Premium') {
      if (countryName === 'India') {
        onPremiumINRSub();
      } else {
        onPremiumSub();
      }
    }
  }

  const billing = (billPlan: string, plan: { price: { monthly: { inr: number, usd: number }, annually: { inr: number, usd: number } } }): string => {
    if (billPlan === 'monthly') {
      if (countryName === 'India') {
        return '₹' + plan.price.monthly.inr;
      }
      return '$' + plan.price.monthly.usd;
    } else {
      if (countryName === 'India') {
        return '₹' + plan.price.annually.inr;
      }
      return '$' + plan.price.annually.usd;
    }
  }

  return (
    <div className="text-gray-900 bg-white px-4 py-16 dark:bg-dark dark:border-dark-gray border-0 border-black border-t-[1px] relative">
      <span className="absolute top-5 right-5 text-xs text-do-first bg-do-first-alpha px-3 py-2 rounded-md animate__animated animate__bounceIn">Pricing</span>
      <main>
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-normal md:text-3xl lg:text-4xl font-poppins-light text-dark dark:text-white">
            Our <span className="font-poppins-medium">plans</span> for your{' '}
            <span className="font-poppins-medium">strategies</span>
          </h1>
          <p className="text-sm font-normal text-gray-400 font-poppins-light">
            Choose a plan that suits you the best.
          </p>
          <p className="text-sm font-normal text-gray-400 font-poppins-light">
            It starts from here! You can teach yourself what you really like.
          </p>
        </div>

        {/* Plan switch */}
        {/* <div className="flex items-center justify-center mt-10 space-x-4">
          <span className="text-base font-poppins-medium text-dark dark:text-white">Bill Monthly</span>
          <button
            className="relative rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-done"
            onClick={() => setBillPlan(billPlan === 'monthly' ? 'annually' : 'monthly')}
          >
            <div className="w-16 h-8 transition bg-done rounded-full shadow-md outline-none"></div>
            <div
              className={`absolute inline-flex items-center justify-center w-6 h-6 transition-all duration-200 ease-in-out transform bg-white rounded-full shadow-sm top-1 left-1 ${billPlan === 'monthly' ? 'translate-x-0' : 'translate-x-8'
                }`}
            ></div>
          </button>
          <span className="text-base font-poppins-medium text-dark dark:text-white">Bill Annually</span>
        </div> */}

        {/* Plans */}
        <div className="flex flex-col items-center justify-center mt-16 space-y-8 lg:flex-row lg:items-stretch lg:space-x-8 lg:space-y-0">
          {plans.map((plan, i) => (
            <section key={i} className={`flex flex-col w-full max-w-sm p-12 space-y-6 bg-white dark:bg-dark dark:border-dark-gray ${plan.name === 'Standard' ? 'border-done' : 'border-black'} border-[1px]`}>
              <div className="flex-shrink-0">
                <span
                  className={`text-4xl font-poppins-medium tracking-tight ${plan.name === 'Standard' ? 'text-green-500' : 'text-dark dark:text-white'
                    }`}
                >
                  {billing(billPlan, plan)}
                </span>
                <span className="text-gray-400">{billPlan === 'monthly' ? '/month' : '/year'}</span>
              </div>

              <div className="flex-shrink-0 pb-6 space-y-2 border-b">
                <h2 className="text-2xl font-poppins-regular text-dark dark:text-white">{plan.name}</h2>
                <p className="text-sm text-gray-400">{plan.discretion}</p>
              </div>

              <ul className="flex-1 space-y-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg
                      className="flex-shrink-0 w-6 h-6 text-green-300"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                        className='animate__animated animate__bounceIn'
                      />
                    </svg>
                    <span className="ml-3 text-base font-poppins-medium text-dark dark:text-white">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex-shrink-0 pt-4">
                {plan.name !== 'Basic' && <button
                  className={`inline-flex items-center justify-center w-full max-w-xs px-4 py-2 transition-colors border rounded focus:outline-none font-poppins-bold ${plan.name === 'Standard'
                    ? 'text-do-first bg-do-first-alpha'
                    : 'hover:bg-do-first-alpha hover:text-do-first text-dark dark:text-white'
                    }`}
                  onClick={() => onSubscribe(plan)}>
                  Get {plan.name}
                </button>}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
};

export default withLoading(PricingPlan, 'Task hard, subscribe harder! Your brainpower funds our coffee addiction. ☕💻');
