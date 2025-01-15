import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getStoredGeminiKey, setGeminiKey, clearGeminiKey } from '@/services/gemini';
import { toast } from "@/components/ui/use-toast";

const ApiKeySettings = () => {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApiKey = async () => {
      const key = await getStoredGeminiKey();
      if (key) {
        setApiKey(key);
      }
      setLoading(false);
    };
    fetchApiKey();
  }, []);

  const handleSave = () => {
    if (apiKey.trim()) {
      setGeminiKey(apiKey.trim());
      toast({
        title: "API Key Saved",
        description: "Your Gemini API key has been saved successfully.",
      });
    }
  };

  const handleClear = () => {
    clearGeminiKey();
    setApiKey('');
    toast({
      title: "API Key Cleared",
      description: "Your Gemini API key has been removed.",
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>API Settings</CardTitle>
        <CardDescription>
          Configure your Gemini API key to enable fundamental analysis.
          Get your API key from the{" "}
          <a 
            href="https://makersuite.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Google AI Studio
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="Enter your Gemini API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSave}>Save</Button>
            <Button variant="outline" onClick={handleClear}>Clear</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeySettings;