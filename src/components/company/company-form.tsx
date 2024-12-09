import { useForm } from 'react-hook-form';
import type { Company } from '../../types/company';
import { EMIRATES, BUSINESS_TYPES, FREE_ZONES } from '../../types/company';
import { companyService } from '../../lib/services/company';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';

interface CompanyFormProps {
  company?: Company;
  onSuccess: () => void;
}

export function CompanyForm({ company, onSuccess }: CompanyFormProps) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<Company>({
    defaultValues: company || {
      baseCurrency: 'AED',
      defaultVatRate: 5,
      reverseChargeMechanism: false,
      defaultPaymentTerms: 30
    }
  });

  const selectedEmirate = watch('emirate');
  const selectedBusinessType = watch('primaryBusinessType');

  const onSubmit = async (data: Company) => {
    try {
      if (company?.id) {
        await companyService.update(company.id, data);
      } else {
        await companyService.create(data);
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save company:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Company Name (EN)</label>
          <Input
            {...register('companyNameEn', { required: 'Company name is required' })}
            error={errors.companyNameEn?.message}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Company Name (AR)</label>
          <Input
            {...register('companyNameAr', { required: 'Arabic name is required' })}
            error={errors.companyNameAr?.message}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Trade License Number</label>
          <Input
            {...register('tradeLicenseNumber', { required: 'License number is required' })}
            error={errors.tradeLicenseNumber?.message}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Primary Business Type</label>
          <Select
            {...register('primaryBusinessType', { required: 'Business type is required' })}
            error={errors.primaryBusinessType?.message}
          >
            <option value="">Select business type</option>
            {BUSINESS_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </Select>
        </div>
      </div>

      {selectedBusinessType === 'Other' && (
        <div>
          <label className="block text-sm font-medium mb-1">Business Type Description</label>
          <Input
            {...register('businessTypeDescription', { required: 'Description is required for Other business type' })}
            error={errors.businessTypeDescription?.message}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Emirate</label>
          <Select
            {...register('emirate', { required: 'Emirate is required' })}
            error={errors.emirate?.message}
          >
            <option value="">Select emirate</option>
            {EMIRATES.map(emirate => (
              <option key={emirate} value={emirate}>{emirate}</option>
            ))}
          </Select>
        </div>
        {selectedEmirate && FREE_ZONES[selectedEmirate as keyof typeof FREE_ZONES] && (
          <div>
            <label className="block text-sm font-medium mb-1">Free Zone</label>
            <Select {...register('freeZone')}>
              <option value="">Select free zone</option>
              {FREE_ZONES[selectedEmirate as keyof typeof FREE_ZONES].map(zone => (
                <option key={zone} value={zone}>{zone}</option>
              ))}
            </Select>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Billing Address</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input {...register('billingAddress.street', { required: true })} placeholder="Street" />
          <Input {...register('billingAddress.city', { required: true })} placeholder="City" />
          <Input {...register('billingAddress.state', { required: true })} placeholder="State" />
          <Input {...register('billingAddress.postalCode', { required: true })} placeholder="Postal Code" />
          <Input {...register('billingAddress.country', { required: true })} placeholder="Country" />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Contact Person</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input {...register('contactPerson.firstName', { required: true })} placeholder="First Name" />
          <Input {...register('contactPerson.lastName', { required: true })} placeholder="Last Name" />
          <Input 
            {...register('contactPerson.email', { 
              required: true,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })} 
            placeholder="Email" 
          />
          <Input {...register('contactPerson.phoneNumber', { required: true })} placeholder="Phone Number" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Website</label>
          <Input {...register('website')} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Default Payment Terms (days)</label>
          <Input
            type="number"
            {...register('defaultPaymentTerms', { 
              required: true,
              min: { value: 0, message: 'Must be positive' }
            })}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Financial Settings</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Base Currency</label>
            <Input {...register('baseCurrency')} disabled value="AED" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Default VAT Rate (%)</label>
            <Input
              type="number"
              {...register('defaultVatRate', { 
                required: true,
                min: { value: 0, message: 'Must be positive' }
              })}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox {...register('reverseChargeMechanism')} />
        <label className="text-sm">Enable Reverse Charge Mechanism</label>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="submit" variant="primary">
          {company ? 'Update Company' : 'Create Company'}
        </Button>
      </div>
    </form>
  );
}
