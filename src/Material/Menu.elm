module Material.Menu exposing
    ( MenuConfig, menuConfig
    , menu, menuSurfaceAnchor
    )

{-|

@docs MenuConfig, menuConfig
@docs menu, menuSurfaceAnchor

-}

import Html exposing (Html, text)
import Html.Attributes exposing (class)
import Html.Events
import Json.Decode as Decode


{-| TODO docs
-}
type alias MenuConfig msg =
    { open : Bool
    , quickOpen : Bool
    , additionalAttributes : List (Html.Attribute msg)
    , onClose : Maybe msg
    }


{-| TODO docs
-}
menuConfig : MenuConfig msg
menuConfig =
    { open = False
    , quickOpen = False
    , additionalAttributes = []
    , onClose = Nothing
    }


{-| TODO docs
-}
menu : MenuConfig msg -> List (Html msg) -> Html msg
menu config nodes =
    Html.node "mdc-menu"
        (List.filterMap identity
            [ rootCs
            , openAttr config
            , quickOpenAttr config
            , closeHandler config
            ]
            ++ config.additionalAttributes
        )
        nodes


{-| TODO docs
-}
menuSurfaceAnchor : Html.Attribute msg
menuSurfaceAnchor =
    class "mdc-menu-surface--anchor"


rootCs : Maybe (Html.Attribute msg)
rootCs =
    Just (class "mdc-menu mdc-menu-surface")


openAttr : MenuConfig msg -> Maybe (Html.Attribute msg)
openAttr { open } =
    if open then
        Just (Html.Attributes.attribute "open" "")

    else
        Nothing


quickOpenAttr : MenuConfig msg -> Maybe (Html.Attribute msg)
quickOpenAttr { quickOpen } =
    if quickOpen then
        Just (Html.Attributes.attribute "quickopen" "")

    else
        Nothing


closeHandler : MenuConfig msg -> Maybe (Html.Attribute msg)
closeHandler { onClose } =
    Maybe.map (Html.Events.on "MDCMenu:close" << Decode.succeed) onClose
