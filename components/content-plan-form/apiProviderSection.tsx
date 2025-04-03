import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ApiProvider } from "./types";

interface ApiProviderSectionProps {
  apiProvider: ApiProvider;
  apiKey: string;
  onProviderChange: (provider: ApiProvider) => void;
  onApiKeyChange: (key: string) => void;
}

export function ApiProviderSection({
  apiProvider,
  apiKey,
  onProviderChange,
  onApiKeyChange
}: ApiProviderSectionProps) {
  return (
    <>
      <div className="space-y-2 sm:col-span-2">
        <Label>API Provider</Label>
        <div className="flex space-x-4">
          {(['huggingface', 'openai'] as ApiProvider[]).map(provider => (
            <div key={provider} className="flex items-center">
              <input
                type="radio"
                id={provider}
                name="api_provider"
                value={provider}
                checked={apiProvider === provider}
                onChange={() => onProviderChange(provider)}
                className="mr-2"
              />
              <Label htmlFor={provider}>
                {provider === 'huggingface' ? 'Hugging Face (Free)' : 'OpenAI (Paid)'}
              </Label>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="api_key">
          {apiProvider === "openai" ? "OpenAI API Key" : "Hugging Face API Key"}
        </Label>
        <Input
          id="api_key"
          name="api_key"
          type="password"
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          placeholder={apiProvider === "openai" ? "sk-..." : "hf_..."}
          required
        />
      </div>
    </>
  );
}
