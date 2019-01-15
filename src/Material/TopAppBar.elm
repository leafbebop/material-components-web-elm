module Material.TopAppBar exposing
    ( Config
    , Variant(..)
    , actionItem
    , alignEnd
    , alignStart
    , navigationIcon
    , row
    , section
    , title
    , topAppBar
    , topAppBarConfig
    )

import Html exposing (Html, text)
import Html.Attributes exposing (class)


type alias Config msg =
    { variant : Variant
    , dense : Bool
    , fixed : Bool
    , additionalAttributes : List (Html.Attribute msg)
    }


type Variant
    = Default
    | Short
    | ShortCollapsed
    | Prominent


topAppBarConfig : Config msg
topAppBarConfig =
    { variant = Default
    , dense = False
    , fixed = False
    , additionalAttributes = []
    }


topAppBar : Config msg -> List (Html msg) -> Html msg
topAppBar config nodes =
    Html.node "mdc-top-app-bar"
        (List.filterMap identity
            [ rootCs
            , variantCs config
            , denseCs config
            , fixedCs config
            ]
            ++ config.additionalAttributes
        )
        nodes


row : List (Html.Attribute msg) -> List (Html msg) -> Html msg
row attributes nodes =
    Html.section ([ class "mdc-top-app-bar__row" ] ++ attributes) nodes


section : List (Html.Attribute msg) -> List (Html msg) -> Html msg
section attributes nodes =
    Html.section ([ class "mdc-top-app-bar__section" ] ++ attributes) nodes


alignStart : Html.Attribute msg
alignStart =
    class "mdc-top-app-bar__section--align-start"


alignEnd : Html.Attribute msg
alignEnd =
    class "mdc-top-app-bar__section--align-end"


navigationIcon : Html.Attribute msg
navigationIcon =
    class "mdc-top-app-bar__navigation-icon"


title : Html.Attribute msg
title =
    class "mdc-top-app-bar__title"


actionItem : Html.Attribute msg
actionItem =
    class "mdc-top-app-bar__action-item"


rootCs : Maybe (Html.Attribute msg)
rootCs =
    Just (class "mdc-top-app-bar")


variantCs : Config msg -> Maybe (Html.Attribute msg)
variantCs { variant } =
    case variant of
        Default ->
            Nothing

        Short ->
            Just (class "mdc-top-app-bar--short")

        ShortCollapsed ->
            Just (class "mdc-top-app-bar--short mdc-top-app-bar--short-collapsed")

        Prominent ->
            Just (class "mdc-top-app-bar--prominent")


denseCs : Config msg -> Maybe (Html.Attribute msg)
denseCs { dense } =
    if dense then
        Just (class "mdc-top-app-bar--dense")

    else
        Nothing


fixedCs : Config msg -> Maybe (Html.Attribute msg)
fixedCs { fixed } =
    if fixed then
        Just (class "mdc-top-app-bar--fixed")

    else
        Nothing


fixedAdjust : Config msg -> Html.Attribute msg
fixedAdjust { variant, dense } =
    case ( variant, dense ) of
        ( Short, _ ) ->
            class "mdc-top-app-bar--short-fixed-adjust"

        ( ShortCollapsed, _ ) ->
            class "mdc-top-app-bar--short-fixed-adjust"

        ( Prominent, True ) ->
            class "mdc-top-app-bar--dense-prominent-fixed-adjust"

        ( Prominent, False ) ->
            class "mdc-top-app-bar--prominent-fixed-adjust"

        ( _, True ) ->
            class "mdc-top-app-bar--dense-fixed-adjust"

        _ ->
            class "mdc-top-app-bar-fixed-adjust"