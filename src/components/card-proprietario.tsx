{
  /* Card de Informações do Perfil para Mobile
              <Card className="border-gray-200 bg-white shadow-md md:hidden">
                <CardContent>
                  <div className="space-y-4 text-start">
                    <p className="text-lg font-semibold text-gray-900">
                      Perfil do Proprietário
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-gray-300 shadow-md duration-300 hover:scale-[1.02]">
                        {property.owner?.profileImage ? (
                          <Image
                            src={property.owner.profileImage}
                            alt="Foto do proprietário"
                            width={64}
                            height={64}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gray-200">
                            <UserRound className="h-8 w-8 text-gray-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        {property.owner ? (
                          <div className="space-y-2 text-sm">
                            <p className="text-gray-500">
                              Nome:{" "}
                              <span className="font-medium text-gray-700">
                                {property.owner.fullName || "Não informado"}
                              </span>
                            </p>
                            <div className="flex gap-8">
                              <div className="space-y-1">
                                <p className="text-gray-500">Contatos:</p>
                                <div className="ml-2 space-y-1">
                                  <span className="block font-medium text-gray-700">
                                    {property.owner.email || "Não informado"}
                                  </span>
                                  <span className="block font-medium text-gray-700">
                                    {property.owner.phone || "Não informado"}
                                  </span>
                                </div>
                              </div>
                              {((property.owner.instagram &&
                                property.owner.instagram.trim() !== "") ||
                                (property.owner.website &&
                                  property.owner.website.trim() !== "")) && (
                                <div>
                                  <p className="mb-2 text-gray-500">Redes:</p>
                                  <div className="ml-2 flex gap-3">
                                    {property.owner.instagram &&
                                      property.owner.instagram.trim() !==
                                        "" && (
                                        <Link
                                          href={
                                            property.owner.instagram.startsWith(
                                              "http",
                                            )
                                              ? property.owner.instagram
                                              : `https://instagram.com/${property.owner.instagram.replace("@", "")}`
                                          }
                                          target="_blank"
                                          className="flex items-center gap-1 text-gray-700 transition-colors hover:text-gray-800"
                                          title="Instagram"
                                        >
                                          <Instagram className="h-4 w-4" />
                                        </Link>
                                      )}
                                    {property.owner.website &&
                                      property.owner.website.trim() !== "" && (
                                        <Link
                                          href={
                                            property.owner.website.startsWith(
                                              "http",
                                            )
                                              ? property.owner.website
                                              : `https://${property.owner.website}`
                                          }
                                          target="_blank"
                                          className="flex items-center gap-1 text-gray-700 transition-colors hover:text-gray-800"
                                          title="Website"
                                        >
                                          <Link2 className="h-4 w-4" />
                                        </Link>
                                      )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2 text-sm">
                            <p className="text-gray-700">
                              Nome:{" "}
                              <span className="font-medium text-gray-900">
                                Não informado
                              </span>
                            </p>
                            <div className="space-y-1">
                              <p className="text-gray-700">Contatos:</p>
                              <div className="ml-2 space-y-1">
                                <span className="block text-gray-900">
                                  Não informado
                                </span>
                                <span className="block text-gray-900">
                                  Não informado
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-500 italic">
                              Informações do proprietário não disponíveis
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card> */
}

{
  /* Card de Informações do Perfil
            <Card className="hidden border-gray-200 bg-white shadow-md md:block">
              <CardContent>
                <div className="space-y-4 text-start">
                  <p className="text-lg font-semibold text-gray-900">
                    Perfil do Proprietário
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-gray-300 shadow-md duration-300 hover:scale-[1.02]">
                      {property.owner?.profileImage ? (
                        <Image
                          src={property.owner.profileImage}
                          alt="Foto do proprietário"
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-200">
                          <UserRound className="h-8 w-8 text-gray-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      {property.owner ? (
                        <div className="space-y-2 text-sm">
                          <p className="text-gray-500">
                            Nome:{" "}
                            <span className="font-medium text-gray-700">
                              {property.owner.fullName || "Não informado"}
                            </span>
                          </p>
                          <div className="flex gap-8">
                            <div className="space-y-1">
                              <p className="text-gray-500">Contatos:</p>
                              <div className="ml-2 space-y-1">
                                <span className="block font-medium text-gray-700">
                                  {property.owner.email || "Não informado"}
                                </span>
                                <span className="block font-medium text-gray-700">
                                  {property.owner.phone || "Não informado"}
                                </span>
                              </div>
                            </div>
                            {((property.owner.instagram &&
                              property.owner.instagram.trim() !== "") ||
                              (property.owner.website &&
                                property.owner.website.trim() !== "")) && (
                              <div>
                                <p className="mb-2 text-gray-500">Redes:</p>
                                <div className="ml-2 flex gap-3">
                                  {property.owner.instagram &&
                                    property.owner.instagram.trim() !== "" && (
                                      <Link
                                        href={
                                          property.owner.instagram.startsWith(
                                            "http",
                                          )
                                            ? property.owner.instagram
                                            : `https://instagram.com/${property.owner.instagram.replace("@", "")}`
                                        }
                                        target="_blank"
                                        className="flex items-center gap-1 text-gray-700 transition-colors hover:text-gray-800"
                                        title="Instagram"
                                      >
                                        <Instagram className="h-4 w-4" />
                                      </Link>
                                    )}
                                  {property.owner.website &&
                                    property.owner.website.trim() !== "" && (
                                      <Link
                                        href={
                                          property.owner.website.startsWith(
                                            "http",
                                          )
                                            ? property.owner.website
                                            : `https://${property.owner.website}`
                                        }
                                        target="_blank"
                                        className="flex items-center gap-1 text-gray-700 transition-colors hover:text-gray-800"
                                        title="Website"
                                      >
                                        <Link2 className="h-4 w-4" />
                                      </Link>
                                    )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2 text-sm">
                          <p className="text-gray-700">
                            Nome:{" "}
                            <span className="font-medium text-gray-900">
                              Não informado
                            </span>
                          </p>
                          <div className="space-y-1">
                            <p className="text-gray-700">Contatos:</p>
                            <div className="ml-2 space-y-1">
                              <span className="block text-gray-900">
                                Não informado
                              </span>
                              <span className="block text-gray-900">
                                Não informado
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 italic">
                            Informações do proprietário não disponíveis
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card> */
}
