
import { SparklesIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const AIMatchingCard = () => {
  return (
    <Card className="border-kita-orange/20 bg-gradient-to-b from-kita-cream to-white">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2">
          <SparklesIcon className="h-6 w-6 text-kita-orange" />
          <CardTitle className="text-lg">KI-Job-Matching</CardTitle>
        </div>
        <CardDescription>
          Lass dir passende Jobs vorschlagen
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm">
          Erstelle dein persönliches Profil und erhalte maßgeschneiderte Jobangebote, die zu deinen Qualifikationen und Wünschen passen.
        </p>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-kita-orange hover:bg-kita-orange/90 text-white">
          Zum KI-Matching
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AIMatchingCard;
