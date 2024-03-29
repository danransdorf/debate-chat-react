import FormHelp from "@/components/FormHelp";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createChatTE } from "@/lib/api";
import { cleanString, generateID } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import * as O from "fp-ts/Option";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().optional(),
  id: z.string().optional(),
  password: z.string({
    required_error: "Heslo je povinné",
  }),
});

function Home() {
  const navigate = useNavigate();

  const createForm = useForm<z.infer<typeof createSchema>>({
    resolver: zodResolver(createSchema),
  });

  const cleanOrElse =
    (elseValue: string) => (value: string | null | undefined) =>
      pipe(
        value,
        O.fromNullable,
        O.map(cleanString),
        O.getOrElse(() => elseValue)
      );

  const onSubmit = async (values: z.infer<typeof createSchema>) =>
    pipe(
      values.id,
      cleanOrElse(generateID()),
      (chatID) => createChatTE(values.title || "", chatID, values.password),
      TE.matchW(
        (error) => {
          console.log(error);
          createForm.setError("id", {
            type: "custom",
            message: "Chat s tímto kódem již existuje. Zkuste jiný.",
          });
          return error;
        },
        ({ adminToken, id }) => {
          console.log(adminToken);
          Cookies.set("adminToken", adminToken, { expires: 1 });
          navigate(`/admin/${id}`, { replace: true });
          return { adminToken, id };
        }
      )
    )();

  return (
    <Card className="max-w-lg w-full">
      <CardHeader>
        <CardTitle>Vytvoření chatu</CardTitle>
      </CardHeader>
      <Form {...createForm}>
        <form onSubmit={createForm.handleSubmit(onSubmit)}>
          <CardContent className="space-y-2">
            <FormField
              control={createForm.control}
              name="title"
              render={({ field }) => (
                <FormItem className="space-y-1 w-full">
                  <FormLabel
                    htmlFor="title"
                    className="flex items-center gap-2"
                  >
                    Název (nepovinné)
                    <FormHelp>
                      Název, který bude reprezentovat váš chat, např. Rozhovor s
                      Janem Novotným
                    </FormHelp>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={createForm.control}
              name="id"
              render={({ field }) => (
                <FormItem className="space-y-1 w-full">
                  <FormLabel htmlFor="id" className="flex items-center gap-2">
                    Kód pro připojení diváka (nepovinné)
                    <FormHelp>
                      Kód chatu, který zadávají diváci, když se připojují do
                      chatu, např. jan-novotny. Když kód nezadáte, bude
                      vygenerován automaticky.
                    </FormHelp>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={createForm.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1 w-full">
                  <FormLabel
                    htmlFor="password"
                    className="flex items-center gap-2"
                  >
                    Heslo moderátora chatu
                    <FormHelp>
                      Heslo pro přihlášení do chatu jako moderátor
                    </FormHelp>
                  </FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full">
              Vytvořit
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

export default Home;
