import {useState} from 'react';
import stepsData from '../data/howToSteps.json';

function Step({number, title, children}) {
  return (
    <div className="step mb-3">
      <div className="step-title fw-bold">
        {number}. {title}
      </div>
      <p>{children}</p>
    </div>
  );
}

export default function HowItWorksView() {
  let [toggle, setToggle] = useState('petsitting');
  const steps = stepsData;

  return (
    <>
      <div className="container my-5" style={{maxWidth: '70%'}}>
        <div className="p-3 rounded shadow">
          <h2 className="text-center">How It Works</h2>

          <div className="d-flex justify-content-center mb-4">
            <div className="btn-group" role="group" aria-label="Help type">
              {['petsitting', 'forum'].map(step => (
                <>
                  <input
                    type="radio"
                    className="btn-check"
                    name="helpType"
                    id={step}
                    autoComplete="off"
                    checked={toggle === step}
                    onChange={() => setToggle(step)}
                  />
                  <label className="btn btn-outline-secondary" htmlFor={step}>
                    {step === 'petsitting' ? 'Pet Sitting' : 'Forum'}
                  </label>
                </>
              ))}
            </div>
          </div>

          <div className="tab-content" id="howTabsContent">
            {steps[toggle].map((step, index) => (
              <Step key={index} number={index + 1} title={step.title}>
                {step.text}
              </Step>
            ))}
          </div>

          <p className="text-muted small mt-4">Simple. Safe. Stress-free for you and your pet.</p>
        </div>
      </div>
    </>
  );
}
