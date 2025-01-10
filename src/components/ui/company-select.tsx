import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { Building2, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCompanies } from "@/lib/hooks/useCompanies";

interface CompanySelectProps {
  value?: string;
  onChange: (value: string) => void;
}

export function CompanySelect({ value, onChange }: CompanySelectProps) {
  const { companies } = useCompanies({
    perPage: 500,
  });
  const selectedCompany = companies?.find((c) => c.id === value);

  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative text-xs w-full ">
        <Listbox.Button className="relative w-full h-10 cursor-default  bg-white py-2 pl-9 pr-10 text-left border border-input shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <span className="block truncate text-xs">
            {selectedCompany?.companyNameEN || "All Companies"}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto  bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-xs z-[999]">
            <Listbox.Option
              className={({ active }) =>
                cn(
                  "relative cursor-default select-none py-2 pl-10 pr-4",
                  active ? "bg-primary text-white" : "text-gray-900"
                )
              }
              value=""
            >
              {({ selected, active }) => (
                <>
                  <span className="block truncate">All Companies</span>
                  {selected && (
                    <span
                      className={cn(
                        "absolute inset-y-0 left-0 flex items-center pl-3",
                        active ? "text-white" : "text-primary"
                      )}
                    >
                      <Check className="h-4 w-4" aria-hidden="true" />
                    </span>
                  )}
                </>
              )}
            </Listbox.Option>
            {companies?.map((company) => (
              <Listbox.Option
                key={company.id}
                className={({ active }) =>
                  cn(
                    "relative cursor-default select-none py-2 pl-10 pr-4",
                    active ? "bg-primary text-white" : "text-gray-900"
                  )
                }
                value={company.id}
              >
                {({ selected, active }) => (
                  <>
                    <span className="block truncate">
                      {company.companyNameEN}
                    </span>
                    {selected && (
                      <span
                        className={cn(
                          "absolute inset-y-0 left-0 flex items-center pl-3",
                          active ? "text-white" : "text-primary"
                        )}
                      >
                        <Check className="h-4 w-4" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
