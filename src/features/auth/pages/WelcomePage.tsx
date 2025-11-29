import { User, Building2, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/shared/ui/shadcn/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/shadcn/card'

export const WelcomePage = () => {
  const navigate = useNavigate()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to Round</CardTitle>
        <CardDescription>Your billing and customer intelligence platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <Button
            onClick={() => navigate('/login')}
            variant="outline"
            className="w-full h-auto p-4 justify-start"
          >
            <div className="flex items-center gap-4 w-full">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-foreground">Personal</div>
                <div className="text-sm text-muted-foreground">Individual account for personal use</div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0" />
            </div>
          </Button>

          <Button
            onClick={() => navigate('/login/business')}
            variant="outline"
            className="w-full h-auto p-4 justify-start"
          >
            <div className="flex items-center gap-4 w-full">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-foreground">Business</div>
                <div className="text-sm text-muted-foreground">Company account for business use</div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0" />
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
