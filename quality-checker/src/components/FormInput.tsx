interface FormInputProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

export const FormInput = ({
  icon,
  label,
  value,
  onChange,
  placeholder,
}: FormInputProps) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      {icon}
      <label className="text-base font-electrolize text-gray-200">
        {label}
      </label>
    </div>
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>
);
