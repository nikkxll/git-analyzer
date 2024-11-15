import { HelpCircle } from "lucide-react";

interface FormInputProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  tooltip?: string;
  dropdown?: {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
  };
}

export const FormInput = ({
  icon,
  label,
  value,
  onChange,
  placeholder,
  tooltip,
  dropdown,
}: FormInputProps) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        {icon}
        <label className="text-base font-electrolize text-gray-200">
          {label}
        </label>
      </div>
      {tooltip && (
        <div className="relative group">
          <div className="text-gray-400 cursor-help">
            <HelpCircle size={16} />
          </div>
          <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 w-[525px] p-4 bg-gray-800 text-sm text-gray-200 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-50 whitespace-normal">
            {tooltip === "file-tooltip" ? (
            <div className="font-mono text-xs">
              To get the file SHA: Go to the terminal →<br />
              curl https://api.github.com/repos/
              <span className="text-blue-400">{"{user}"}</span>/
              <span className="text-blue-400">{"{repo}"}</span>/contents/
              <span className="text-blue-400">{"{file_name}"}</span>
              <br /> <br /> Replace user, repo, and file_name with the actual
              values
            </div>
            ) : (
            <div className="font-mono text-xs">
              To get the commit SHA: Go to the GitHub repo → Click on the commits → Copy Full SHA
            </div>
            )}
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-800"></div>
          </div>
        </div>
      )}
    </div>
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
    {dropdown && (
      <div className="flex items-center justify-start mt-2 pt-4">
        <select
          value={dropdown.value}
          onChange={(e) => dropdown.onChange(e.target.value)}
          className="bg-gray-800/50 border border-gray-600 rounded-lg text-white px-3 py-1 text-sm font-electrolize focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8"
          style={{
            backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'><path stroke='%23888' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/></svg>")`,
            backgroundPosition: "right 0.33rem center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "1.5em 1.5em",
          }}
        >
          {dropdown.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    )}
  </div>
);
