"use client"
import { Fragment, useState } from "react"
import { Menu, Transition } from "@headlessui/react"
import { Cog6ToothIcon, Bars3Icon } from "@heroicons/react/24/outline"
import {
  ChevronDownIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  SunIcon,
} from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  resource: z.string().min(2).max(50),
})

const navigation = [
  { name: "Dashboard", href: "#", icon: HomeIcon, current: true },
]

const userNavigation = [
  { name: "Your profile", href: "#" },
  { name: "Sign out", href: "#" },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

function SearchForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resource: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full relative flex flex-1"
      >
        <FormField
          control={form.control}
          name="resource"
          render={({ field }) => (
            <FormItem className="h-full w-full relative flex flex-1">
              <FormControl>
                <Input
                  className="h-full border-none ring-none focus-visible:ring-0"
                  placeholder="Search..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  return (
    <>
      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
              alt="Your Company"
            />
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-indigo-700 text-white"
                            : "text-indigo-200 hover:text-white hover:bg-indigo-700",
                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                        )}
                      >
                        <item.icon
                          className={classNames(
                            item.current
                              ? "text-white"
                              : "text-indigo-200 group-hover:text-white",
                            "h-6 w-6 shrink-0"
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <a
                  href="#"
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-indigo-200 hover:bg-indigo-700 hover:text-white"
                >
                  <Cog6ToothIcon
                    className="h-6 w-6 shrink-0 text-indigo-200 group-hover:text-white"
                    aria-hidden="true"
                  />
                  Settings
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="lg:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <SearchForm />
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <Button
                size="icon"
                variant="link"
                onClick={() => setTheme(theme == "light" ? "dark" : "light")}
              >
                <SunIcon className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <MoonIcon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>

              {/* Profile dropdown */}
              <Menu as="div" className="relative">
                <Menu.Button className="-m-1.5 flex items-center p-1.5">
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="h-8 w-8 rounded-full bg-gray-50"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                  <span className="hidden lg:flex lg:items-center">
                    <span
                      className="ml-4 text-sm font-semibold leading-6"
                      aria-hidden="true"
                    >
                      Tom Cook
                    </span>
                    <ChevronDownIcon
                      className="ml-2 h-5 w-5"
                      aria-hidden="true"
                    />
                  </span>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                    {userNavigation.map((item) => (
                      <Menu.Item key={item.name}>
                        {({ active }) => (
                          <a
                            href={item.href}
                            className={classNames(
                              active ? "bg-gray-50" : "",
                              "block px-3 py-1 text-sm leading-6 text-gray-900"
                            )}
                          >
                            {item.name}
                          </a>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </>
  )
}
