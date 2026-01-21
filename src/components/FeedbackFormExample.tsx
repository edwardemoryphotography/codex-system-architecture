import { useState } from 'react';
import { Mail, User, MessageSquare, Send, X } from 'lucide-react';
import { FormInput, FormTextarea, FormSelect, FormButton } from './form';
import { useFormValidation } from '../hooks/useFormValidation';
import { validators, getPasswordStrength } from '../lib/validation';
import { useToast } from './Toast';

interface FeedbackFormExampleProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

interface FormValues {
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
  password: string;
}

export function FeedbackFormExample({ isOpen, onClose, isDarkMode }: FeedbackFormExampleProps) {
  const toast = useToast();
  const [showPasswordDemo, setShowPasswordDemo] = useState(false);

  const [state, actions] = useFormValidation<FormValues>({
    initialValues: {
      name: '',
      email: '',
      category: '',
      subject: '',
      message: '',
      password: '',
    },
    validationSchema: {
      name: [
        validators.required('Please enter your name'),
        validators.minLength(2, 'Name must be at least 2 characters'),
        validators.maxLength(50, 'Name must be less than 50 characters'),
      ],
      email: [
        validators.required('Please enter your email'),
        validators.email('Please enter a valid email address'),
      ],
      category: [
        validators.required('Please select a category'),
      ],
      subject: [
        validators.required('Please enter a subject'),
        validators.minLength(5, 'Subject must be at least 5 characters'),
        validators.maxLength(100, 'Subject must be less than 100 characters'),
      ],
      message: [
        validators.required('Please enter your message'),
        validators.minLength(20, 'Message must be at least 20 characters'),
        validators.maxLength(1000, 'Message must be less than 1000 characters'),
      ],
      password: showPasswordDemo ? [
        validators.required('Please enter a password'),
        validators.minLength(8, 'Password must be at least 8 characters'),
      ] : [],
    },
    validateOnChange: true,
    validateOnBlur: true,
    debounceMs: 300,
  });

  const passwordStrength = getPasswordStrength(state.values.password);

  const handleSubmit = actions.handleSubmit(async (values) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success(
      'Feedback submitted successfully!',
      `Thank you ${values.name}, we\'ll get back to you soon.`
    );
    actions.reset();
    onClose();
  });

  const categoryOptions = [
    { value: 'bug', label: 'Bug Report' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'question', label: 'Question' },
    { value: 'feedback', label: 'General Feedback' },
    { value: 'other', label: 'Other' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={`
          relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden
          ${isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'}
        `}
        style={{ animation: 'modalIn 0.3s ease-out' }}
      >
        <div className={`flex items-center justify-between p-6 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
          <div>
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Form Validation Demo
            </h2>
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Try the inline validation features
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              isDarkMode
                ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Name"
              placeholder="John Doe"
              value={state.values.name}
              onChange={(e) => actions.setValue('name', e.target.value)}
              onBlur={() => actions.setTouched('name')}
              validation={state.fields.name}
              required
              isDarkMode={isDarkMode}
              icon={<User className="w-4 h-4" />}
            />

            <FormInput
              label="Email"
              type="email"
              placeholder="john@example.com"
              value={state.values.email}
              onChange={(e) => actions.setValue('email', e.target.value)}
              onBlur={() => actions.setTouched('email')}
              validation={state.fields.email}
              required
              isDarkMode={isDarkMode}
              icon={<Mail className="w-4 h-4" />}
            />
          </div>

          <FormSelect
            label="Category"
            options={categoryOptions}
            value={state.values.category}
            onChange={(e) => actions.setValue('category', e.target.value)}
            onBlur={() => actions.setTouched('category')}
            validation={state.fields.category}
            required
            isDarkMode={isDarkMode}
            placeholder="Select a category"
          />

          <FormInput
            label="Subject"
            placeholder="Brief description of your feedback"
            value={state.values.subject}
            onChange={(e) => actions.setValue('subject', e.target.value)}
            onBlur={() => actions.setTouched('subject')}
            validation={state.fields.subject}
            required
            isDarkMode={isDarkMode}
            icon={<MessageSquare className="w-4 h-4" />}
            hint="Enter a concise subject for your feedback"
          />

          <FormTextarea
            label="Message"
            placeholder="Please describe your feedback in detail..."
            value={state.values.message}
            onChange={(e) => actions.setValue('message', e.target.value)}
            onBlur={() => actions.setTouched('message')}
            validation={state.fields.message}
            required
            isDarkMode={isDarkMode}
            rows={4}
            maxLength={1000}
            showCount
            hint="Be as detailed as possible"
          />

          <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={showPasswordDemo}
                onChange={(e) => setShowPasswordDemo(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Show password strength demo
              </span>
            </label>
          </div>

          {showPasswordDemo && (
            <FormInput
              label="Password"
              type="password"
              placeholder="Enter a strong password"
              value={state.values.password}
              onChange={(e) => actions.setValue('password', e.target.value)}
              onBlur={() => actions.setTouched('password')}
              validation={state.fields.password}
              required
              isDarkMode={isDarkMode}
              showStrength
              strengthScore={passwordStrength.score}
              strengthLabel={passwordStrength.label}
              hint="Use uppercase, lowercase, numbers, and symbols"
            />
          )}

          <div className={`flex items-center justify-between pt-4 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
            <div className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              {state.isDirty ? (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Unsaved changes
                </span>
              ) : (
                <span>All fields synced</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <FormButton
                type="button"
                variant="ghost"
                onClick={actions.reset}
                isDarkMode={isDarkMode}
                disabled={!state.isDirty}
              >
                Reset
              </FormButton>

              <FormButton
                type="submit"
                variant="primary"
                loading={state.isSubmitting}
                isDarkMode={isDarkMode}
                icon={<Send className="w-4 h-4" />}
              >
                Submit Feedback
              </FormButton>
            </div>
          </div>

          {state.submitCount > 0 && !state.isValid && (
            <div
              className={`p-4 rounded-xl border ${
                isDarkMode
                  ? 'bg-red-500/10 border-red-500/30 text-red-400'
                  : 'bg-red-50 border-red-200 text-red-600'
              }`}
              role="alert"
            >
              <p className="text-sm font-medium">Please fix the errors above before submitting.</p>
            </div>
          )}
        </form>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
